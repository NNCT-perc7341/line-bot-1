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
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({
        message: "success",
    });
}));
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
                    thumbnailImageUrl: "https://example.com/item1.jpg",
                    title: "アイテム1",
                    text: "アイテム1の説明",
                    actions: [
                        { type: "postback", label: "購入", data: "action=buy&itemid=1" },
                        { type: "uri", label: "詳細", uri: "https://example.com/item1" }
                    ]
                },
                {
                    thumbnailImageUrl: "https://example.com/item2.jpg",
                    title: "アイテム2",
                    text: "アイテム2の説明",
                    actions: [
                        { type: "postback", label: "購入", data: "action=buy&itemid=2" },
                        { type: "uri", label: "詳細", uri: "https://example.com/item2" }
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
                    imageUrl: "https://example.com/item1.jpg",
                    action: { type: "uri", label: "詳細", uri: "https://example.com/item1" }
                },
                {
                    imageUrl: "https://example.com/item2.jpg",
                    action: { type: "uri", label: "詳細", uri: "https://example.com/item2" }
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
