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
// イベントを処理する関数
const eventHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.type === "postback") {
        // postbackイベントの処理
        const replyToken = event.replyToken;
        const data = event.postback.data;
        // postbackデータに基づいて画像カルーセルを表示
        if (data === "showImageCarousel" && replyToken) {
            yield sendImageCarouselTemplate(replyToken);
        }
        return;
    }
    else if (event.type === "message" && event.message.type === "text") {
        const replyToken = event.replyToken;
        const { text } = event.message;
        // "a" というメッセージを受信した場合
        if (text === "a" && replyToken) {
            const response = {
                type: "text",
                text: "ABC",
            };
            yield client.replyMessage(replyToken, response);
            return undefined;
        }
        // 他のテンプレートメッセージの処理
        if (replyToken) {
            if (text === "ボタンテンプレート") {
                yield sendButtonTemplate(replyToken);
            }
            else if (text === "確認テンプレート") {
                yield sendConfirmTemplate(replyToken);
            }
            else if (text === "カルーセルテンプレート") {
                yield sendCarouselTemplate(replyToken);
            }
            else if (text === "画像カルーセル") {
                yield sendImageCarouselTemplate(replyToken);
            }
            else {
                // おうむ返しの処理
                const response = {
                    type: "text",
                    text: text,
                };
                yield client.replyMessage(replyToken, response);
            }
        }
    }
    return undefined;
});
// ボタンテンプレートメッセージ（例）
const sendButtonTemplate = (replyToken) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
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
    yield client.replyMessage(replyToken, message);
});
// 確認テンプレートメッセージ（例）
const sendConfirmTemplate = (replyToken) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
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
    yield client.replyMessage(replyToken, message);
});
// カルーセルテンプレートメッセージ（例）
const sendCarouselTemplate = (replyToken) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
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
    yield client.replyMessage(replyToken, message);
});
// 画像カルーセルテンプレートメッセージ
const sendImageCarouselTemplate = (replyToken) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
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
    yield client.replyMessage(replyToken, message);
});
// Webhookエンドポイント
app.post("/webhook", (0, bot_sdk_1.middleware)(middlewareConfig), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = req.body.events;
    yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield eventHandler(event);
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
