"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); // クッキーを処理するために追加
const ts_dotenv_1 = require("ts-dotenv");
const eventHandler_1 = require("./eventHandler");
const env = (0, ts_dotenv_1.load)({
    CHANNEL_ACCESS_TOKEN: String,
    CHANNEL_SECRET: String,
    PORT: Number,
});
const PORT = env.PORT || 3000;
const config = {
    channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
    channelSecret: env.CHANNEL_SECRET || "",
};
const middlewareConfig = config;
const client = new bot_sdk_1.Client({
    channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
});
const app = (0, express_1.default)();
// クッキーを使用するためのミドルウェアを追加
app.use((0, cookie_parser_1.default)());
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({
        message: "success",
    });
}));
// ページA：アクセス時の日時をクッキーに保存
app.get("/pageA", (req, res) => {
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
app.get("/pageB", (req, res) => {
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
    }
    else {
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
app.get("/login", (req, res) => {
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
            if (parts.length === 2) return parts.pop().split(";").shift();
          }

          // 情報を呼び出すボタンが押されたときの処理
          function loadInfo() {
            const email = decodeURIComponent(getCookie('email') || ''); // デコードを追加
            const lineId = decodeURIComponent(getCookie('lineId') || ''); // デコードを追加
            if (email && lineId) {
              document.getElementById('email').value = email;
              document.getElementById('lineId').value = lineId;
              console.log("メールアドレス:", email);
              console.log("LINE ID:", lineId);
            } else {
              alert('クッキーに保存された情報がありません');
            }
          }

          // 情報を呼び出すボタンが押されたときの処理
          function loadInfo() {
            const email = getCookie('email');
            const lineId = getCookie('lineId');
            if (email && lineId) {
              document.getElementById('email').value = email;
              document.getElementById('lineId').value = lineId;
              console.log("メールアドレス:", email);
              console.log("LINE ID:", lineId);
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

            <button type="submit">ログイン</button>
          </form>
          <button onclick="loadInfo()">情報を呼び出す</button>
        </div>
      </body>
    </html>
  `);
});
// /login/confirmエンドポイントでクッキーに保存し、ログイン完了メッセージを表示
app.post("/login/confirm", express_1.default.urlencoded({ extended: true }), (req, res) => {
    const { email, lineId } = req.body;
    // メールアドレスとLINE IDをクッキーに保存
    res.cookie("email", email, { maxAge: 24 * 60 * 60 * 1000 }); // クライアントからアクセスできるように httpOnly を省略
    res.cookie("lineId", lineId, { maxAge: 24 * 60 * 60 * 1000 }); // クライアントからアクセスできるように httpOnly を省略
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
// Webhookエンドポイント
app.post("/webhook", (0, bot_sdk_1.middleware)(middlewareConfig), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = req.body.events;
    yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, eventHandler_1.eventHandler)(event, client);
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err);
            }
            res.status(500).send("Internal Server Error");
        }
    })));
    res.status(200).send("Events processed");
}));
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
