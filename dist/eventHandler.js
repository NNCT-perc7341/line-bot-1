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
exports.eventHandler = void 0;
const templateMessages_1 = require("./templateMessages");
// イベントを処理する関数
const eventHandler = (event, client) => __awaiter(void 0, void 0, void 0, function* () {
    if (event.type === "postback") { // postbackイベントの処理
        const replyToken = event.replyToken;
        const data = event.postback.data;
        // 画像カルーセルを表示
        if (data === "showImageCarousel" && replyToken) {
            yield (0, templateMessages_1.sendImageCarouselTemplate)(client, replyToken);
        }
        return;
    }
    else if (event.type === "message" && event.message.type === "text") { //messageイベントの処理
        const replyToken = event.replyToken;
        const { text } = event.message;
        const userId = event.source.userId;
        const source = event.source;
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
                yield (0, templateMessages_1.sendButtonTemplate)(client, replyToken);
            }
            else if (text === "確認テンプレート") {
                yield (0, templateMessages_1.sendConfirmTemplate)(client, replyToken);
            }
            else if (text === "カルーセルテンプレート") {
                yield (0, templateMessages_1.sendCarouselTemplate)(client, replyToken);
            }
            else if (text === "画像カルーセル") {
                yield (0, templateMessages_1.sendImageCarouselTemplate)(client, replyToken);
            }
            else if (text === "Line Product Carousel") {
                yield (0, templateMessages_1.lineProductCarousel)(client, replyToken);
            }
            else if (text === "Line Link Button") {
                yield (0, templateMessages_1.lineLinkButton)(client, replyToken);
            }
            else if (text === "Line Order Confirm") {
                yield (0, templateMessages_1.lineOrderConfirm)(client, replyToken);
            }
            else if (text === "Line Status Message 通常") {
                yield (0, templateMessages_1.lineStatusMessageNormal)(client, replyToken);
            }
            else if (text === "Line Status Message キャンセル") {
                yield (0, templateMessages_1.lineStatusMessageCancel)(client, replyToken);
            }
            else if (text === "ログイン") {
                if (userId)
                    yield (0, templateMessages_1.sendLoginForm)(client, replyToken, userId);
                else
                    console.error("ユーザーIDが取得できませんでした");
            }
            else if (text === "rm-test2" && source.userId) {
                try {
                    yield client.linkRichMenuToUser(source.userId, "richmenu-alias-rm-test2");
                    console.log(`Successfully linked rich menu to user ${userId}`);
                }
                catch (error) {
                    const response = {
                        type: "text",
                        text: "Failed to link rich menu",
                    };
                    yield client.replyMessage(replyToken, response);
                }
            }
            else {
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
exports.eventHandler = eventHandler;
