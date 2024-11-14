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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLoginForm = exports.sendImageCarouselTemplate = exports.sendCarouselTemplate = exports.sendConfirmTemplate = exports.sendButtonTemplate = void 0;
// ボタンテンプレートメッセージ（例）
const sendButtonTemplate = (client, replyToken) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.sendButtonTemplate = sendButtonTemplate;
// 確認テンプレートメッセージ（例）
const sendConfirmTemplate = (client, replyToken) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.sendConfirmTemplate = sendConfirmTemplate;
// カルーセルテンプレートメッセージ（例）
const sendCarouselTemplate = (client, replyToken) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.sendCarouselTemplate = sendCarouselTemplate;
// 画像カルーセルテンプレートメッセージ
const sendImageCarouselTemplate = (client, replyToken) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.sendImageCarouselTemplate = sendImageCarouselTemplate;
// ログインフォーム
const sendLoginForm = (client, replyToken, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUrl = `https://line-bot-1-1.vercel.app/login?lineId=${userId}`;
    const message = {
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
    yield client.replyMessage(replyToken, message);
});
exports.sendLoginForm = sendLoginForm;
