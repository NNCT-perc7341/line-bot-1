import {
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
  Client,
  TemplateMessage
} from "@line/bot-sdk";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser"; // クッキーを処理するために追加
import { load } from "ts-dotenv";

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

// イベントを処理する関数
const eventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type === "postback") {     // postbackイベントの処理
    const replyToken = event.replyToken;
    const data = event.postback.data;

    // 画像カルーセルを表示
    if (data === "showImageCarousel" && replyToken) {
      await sendImageCarouselTemplate(replyToken);
    }
    return;
  } else if (event.type === "message" && event.message.type === "text") { //messageイベントの処理
    const replyToken = event.replyToken;
    const { text } = event.message;
    const userId = event.source.userId;

    // "a" というメッセージを受信した場合
    if (text === "a" && replyToken) {
      const response: TextMessage = {
        type: "text",
        text: "ABC",
      };
      await client.replyMessage(replyToken, response);
      return undefined;
    }

    // 他のテンプレートメッセージの処理
    if (replyToken) {
      if (text === "ボタンテンプレート") {
        await sendButtonTemplate(replyToken);
      } else if (text === "確認テンプレート") {
        await sendConfirmTemplate(replyToken);
      } else if (text === "カルーセルテンプレート") {
        await sendCarouselTemplate(replyToken);
      } else if (text === "画像カルーセル") {
        await sendImageCarouselTemplate(replyToken);
      } else if (text === "ログイン") {
        if (userId) await sendLoginForm(replyToken, userId);
        else console.error("ユーザーIDが取得できませんでした");
      } else {
        // おうむ返しの処理
        const response: TextMessage = {
          type: "text",
          text: text,
        };
        await client.replyMessage(replyToken, response);
      }
    }
  }
  return undefined;
};

// ボタンテンプレートメッセージ（例）
const sendButtonTemplate = async (replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これはボタンテンプレートのメッセージです",
    template: {
      type: "buttons",
      title: "メニュー",
      text: "メニューから選択してください",
      actions: [
        { type: "message", label: "選択肢1", text: "選択肢1が選ばれました" },
        { type: "message", label: "選択肢2", text: "選択肢2が選ばれました" },
        { type: "message", label: "選択肢3", text: "選択肢3が選ばれました" },
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// 確認テンプレートメッセージ（例）
const sendConfirmTemplate = async (replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これは確認テンプレートのメッセージです",
    template: {
      type: "confirm",
      text: "この操作を行いますか？",
      actions: [
        { type: "message", label: "はい", text: "はい" },
        { type: "message", label: "いいえ", text: "いいえ" }
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// カルーセルテンプレートメッセージ（例）
const sendCarouselTemplate = async (replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これはカルーセルテンプレートのメッセージです",
    template: {
      type: "carousel",
      columns: [
        {
          thumbnailImageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/antigravity-s_1024x1024.png",
          imageBackgroundColor: "#E6DC61",
          title: "antigravity",
          text: "こんなビールです。",
          actions: [
            { type: "message", label: "購入", text: "購入したい！" },
            { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/antigravity" }
          ]
        },
        {
          thumbnailImageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/minitel-s_1024x1024.png",
          imageBackgroundColor: "#EB9176",
          title: "Minitel",
          text: "こんなビールです",
          actions: [
            { type: "message", label: "購入", text: "購入したい！" },
            { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/minitel" }
          ]
        }
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// 画像カルーセルテンプレートメッセージ
const sendImageCarouselTemplate = async (replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これは画像カルーセルテンプレートのメッセージです",
    template: {
      type: "image_carousel",
      columns: [
        {
          imageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/IMG_0667_1024x1024.jpg",
          action: { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/np" }
        },
        {
          imageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/vga-s_1024x1024.png",
          action: { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/vga" }
        }
      ]
    }
  };
  await client.replyMessage(replyToken, message);
};

// ログインフォーム
const sendLoginForm = async (replyToken: string, userId: string) => {
  const loginUrl = `https://https://line-bot-1-1.vercel.app/login?userId=${userId}`;

  const message: TemplateMessage = {
    type: "template",
    altText: "ログイン用のメッセージです",
    template: {
      type: "buttons",
      title: "ログイン",
      text: "以下のボタンを押してログインしてください",
      actions: [
        {
          type: "uri",
          label: "ログイン",
          uri: loginUrl,
        }
      ]
    }
  };

  await client.replyMessage(replyToken, message);
};

// Webhookエンドポイント
app.post(
  "/webhook",
  middleware(middlewareConfig),
  async (req: Request, res: Response) => {
    const events: WebhookEvent[] = req.body.events;
    await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await eventHandler(event);
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