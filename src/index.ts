import {
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  Client,
} from "@line/bot-sdk";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser"; // クッキーを処理するために追加
import { load } from "ts-dotenv";
import { eventHandler } from "./eventHandler";

const env = load({
  CHANNEL_ACCESS_TOKEN: String,
  CHANNEL_SECRET: String,
  PORT: Number,
});

const PORT = env.PORT || 3000;

const config = {
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
  channelSecret: env.CHANNEL_SECRET || "",
};
const middlewareConfig: MiddlewareConfig = config;

const client = new Client({
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
});

const app: Application = express();

// クッキーを使用するためのミドルウェアを追加
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (_: Request, res: Response) => {
  res.status(200).send({
    message: "success",
  });
});

// ページA：アクセス時の日時をクッキーに保存
app.get("/pageA", (req: Request, res: Response) => {
  const now = new Date();
  now.setHours(now.getHours() + 9); // 日本時間に調整

  const formattedDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}時${now.getMinutes()}分${now.getSeconds()}秒`;

  res.cookie("lastAccess", now.toISOString(), { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // クッキーにはISO形式を保存
  res.status(200).send(`
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
          .content { font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="title">ページA</div>
        <div class="content">アクセス日時を記録しました: ${formattedDate}</div>
      </body>
    </html>
  `);
});

// ページB：ページAで保存した日時を表示
app.get("/pageB", (req: Request, res: Response) => {
  const lastAccess = req.cookies.lastAccess;
  if (lastAccess) {
    const lastAccessDate = new Date(lastAccess);

    const formattedLastAccess = `${lastAccessDate.getFullYear()}年${lastAccessDate.getMonth() + 1}月${lastAccessDate.getDate()}日 ${lastAccessDate.getHours()}時${lastAccessDate.getMinutes()}分${lastAccessDate.getSeconds()}秒`;

    res.status(200).send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="title">ページB</div>
          <div class="content">前回のアクセス日時: ${formattedLastAccess}</div>
        </body>
      </html>
    `);
  } else {
    res.status(200).send(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="title">ページB</div>
          <div class="content">前回のアクセス日時が記録されていません。</div>
        </body>
      </html>
    `);
  }
});

// URLのクエリパラメータからLINE IDを取得し、ログインフォームを表示するエンドポイント
app.get("/login", (req: Request, res: Response) => {
  const lineId = req.query.lineId || ""; // URLのクエリパラメータからLINE IDを取得
  res.send(`
    <html>
      <head>
        <title>ログインフォーム</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { width: 300px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          label { display: block; margin: 10px 0 5px; }
          input { width: 100%; padding: 8px; box-sizing: border-box; }
          button { width: 100%; padding: 10px; margin-top: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
          button:hover { background-color: #45a049; }
        </style>
        <script>
          // クッキーを読み込む関数
          function getCookie(name) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + name + "=");
            if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
          }

          // 情報を呼び出すボタンが押されたときの処理
          function loadInfo() {
            const email = getCookie('email') || '';
            const lineId = getCookie('lineId') || '';
            if (email && lineId) {
              document.getElementById('email').value = email;
              document.getElementById('lineId').value = lineId;
            } else {
              alert('クッキーに保存された情報がありません');
            }
          }
        </script>
      </head>
      <body>
        <div class="container">
          <h2>ログイン</h2>
          <form action="/login/confirm" method="POST">
            <label for="email">メールアドレス:</label>
            <input type="email" id="email" name="email" required>

            <label for="lineId">LINE ID:</label>
            <input type="text" id="lineId" name="lineId" value="${lineId}" readonly>

            <button type="submit">送信</button>
          </form>
          <button onclick="loadInfo()">ログイン情報を表示する</button>
        </div>
      </body>
    </html>
  `);
});

//login/confirmエンドポイントでクッキーに保存し、ログイン完了メッセージを表示
app.post("/login/confirm", (req: Request, res: Response) => {
  const { email, lineId } = req.body;

  // メールアドレスとLINE IDをクッキーに保存
  res.cookie("email", email, { maxAge: 24 * 60 * 60 * 1000 });
  res.cookie("lineId", lineId, { maxAge: 24 * 60 * 60 * 1000 });

  res.send(`
    <html>
      <head>
        <title>ログイン完了</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
        </style>
      </head>
      <body>
        <h2>ログイン完了</h2>
        <p>ログイン情報が保存されました。</p>
        <p><a href="/login">戻る</a></p>
      </body>
    </html>
  `);
});

//login内容を表示するページ
app.get("/login/check", (req: Request, res: Response) => {
  // クッキーからメールアドレスとLINE IDを取得
  const email = req.cookies.email;
  const lineId = req.cookies.lineId;

  // クッキーが存在しない場合の処理
  if (!email || !lineId) {
    res.send(`
      <html>
        <head>
          <title>エラー</title>
          <script>
            alert('ログイン情報が見つかりません。ページを閉じます。');
            window.close(); // ページを閉じる
          </script>
        </head>
        <body></body>
      </html>
    `);
    return;
  }

  // クッキーが存在する場合の表示
  res.send(`
    <html>
      <head>
        <title>ログイン内容の確認</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
          .container { width: 300px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .item { margin-bottom: 10px; font-size: 16px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>ログイン内容</h2>
          <div class="item"><span class="label">メールアドレス:</span> ${email}</div>
          <div class="item"><span class="label">LINE ID:</span> ${lineId}</div>
          <p><a href="/login">戻る</a></p>
        </div>
      </body>
    </html>
  `);
});

// Webhookエンドポイント
app.post(
  "/webhook",
  middleware(middlewareConfig),
  async (req: Request, res: Response) => {
    const events: WebhookEvent[] = req.body.events;
    events.forEach((event) => {
      console.log("Source object:", event.source); // sourceプロパティをログに出力
      console.log("Received POST data:", req.body); // Webhookのリクエストボディをログに出力
    });
    await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await eventHandler(event, client);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }
          res.status(500).send("Internal Server Error");
        }
      })
    );
    res.status(200).send("Events processed");
  }
);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});