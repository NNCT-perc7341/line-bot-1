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

app.get("/", async (_: Request, res: Response) => {
  res.status(200).send({
    message: "success",
  });
});

// ボタンテンプレートメッセージ
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

// 確認テンプレートメッセージ
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

// カルーセルテンプレートメッセージ
const sendCarouselTemplate = async (replyToken: string) => {
  const message: TemplateMessage = {
    type: "template",
    altText: "これはカルーセルテンプレートのメッセージです",
    template: {
      type: "carousel",
      columns: [
        {
          thumbnailImageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/antigravity-s_1024x1024.png",
          title: "antigravity",
          text: "こんなビールです。",
          actions: [
            { type: "message", label: "購入", text: "購入したい！" },
            { type: "uri", label: "詳細", uri: "https://t0ki.beer/blogs/product/antigravity" }
          ]
        },
        {
          thumbnailImageUrl: "https://cdn.shopify.com/s/files/1/0555/7816/5537/files/minitel-s_1024x1024.png",
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

// メッセージを処理する関数
const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;

  // テンプレートメッセージの処理
  if (text === "ボタンテンプレート") {
    await sendButtonTemplate(replyToken);
    return undefined;
  } else if (text === "確認テンプレート") {
    await sendConfirmTemplate(replyToken);
    return undefined;
  } else if (text === "カルーセルテンプレート") {
    await sendCarouselTemplate(replyToken);
    return undefined;
  } else if (text === "画像カルーセル") {
    await sendImageCarouselTemplate(replyToken);
    return undefined;
  }

  // それ以外はおうむ返し
  const response: TextMessage = {
    type: "text",
    text: text,
  };
  await client.replyMessage(replyToken, response);
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
          await textEventHandler(event);
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