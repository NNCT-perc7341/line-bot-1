import { Client, TemplateMessage } from "@line/bot-sdk";

// ボタンテンプレートメッセージ（例）
export const sendButtonTemplate = async (client: Client, replyToken: string) => {
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
export const sendConfirmTemplate = async (client: Client, replyToken: string) => {
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
export const sendCarouselTemplate = async (client: Client, replyToken: string) => {
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
export const sendImageCarouselTemplate = async (client: Client, replyToken: string) => {
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
export const sendLoginForm = async (client: Client, replyToken: string, userId: string) => {
  const loginUrl = `https://line-bot-1-1.vercel.app/login?lineId=${userId}`;

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