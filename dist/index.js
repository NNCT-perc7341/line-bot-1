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
    const now = new Date().toISOString();
    res.cookie("lastAccess", now, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // クッキーを1日保持
    res.status(200).send(`<html><body><p>アクセス日時を記録しました: ${now}</p></body></html>`);
});
// ページB：ページAで保存した日時を表示
app.get("/pageB", (req, res) => {
    const lastAccess = req.cookies.lastAccess;
    if (lastAccess) {
        res.status(200).send(`<html><body><p>前回のアクセス日時: ${lastAccess}</p></body></html>`);
    }
    else {
        res.status(200).send("<html><body><p>前回のアクセス日時が記録されていません。</p></body></html>");
    }
});
// ボタンテンプレートメッセージ
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
// 確認テンプレートメッセージ
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
// カルーセルテンプレートメッセージ
const sendCarouselTemplate = (replyToken) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
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
// メッセージを処理する関数
const textEventHandler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.type !== "message" || event.message.type !== "text") {
        return;
    }
    const { replyToken } = event;
    const { text } = event.message;
    // テンプレートメッセージの処理
    if (text === "ボタンテンプレート") {
        yield sendButtonTemplate(replyToken);
        return undefined;
    }
    else if (text === "確認テンプレート") {
        yield sendConfirmTemplate(replyToken);
        return undefined;
    }
    else if (text === "カルーセルテンプレート") {
        yield sendCarouselTemplate(replyToken);
        return undefined;
    }
    else if (text === "画像カルーセル") {
        yield sendImageCarouselTemplate(replyToken);
        return undefined;
    }
    // それ以外はおうむ返し
    const response = {
        type: "text",
        text: text,
    };
    yield client.replyMessage(replyToken, response);
});
// Webhookエンドポイント
app.post("/webhook", (0, bot_sdk_1.middleware)(middlewareConfig), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = req.body.events;
    yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield textEventHandler(event);
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
