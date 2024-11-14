import { WebhookEvent, Client, MessageAPIResponseBase, TextMessage } from "@line/bot-sdk";
import { 
  sendButtonTemplate, 
  sendConfirmTemplate, 
  sendCarouselTemplate, 
  sendImageCarouselTemplate, 
  sendLoginForm
} from "./templateMessages";

// イベントを処理する関数
export const eventHandler = async (
  event: WebhookEvent,
  client: Client
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type === "postback") {     // postbackイベントの処理
    const replyToken = event.replyToken;
    const data = event.postback.data;

    // 画像カルーセルを表示
    if (data === "showImageCarousel" && replyToken) {
      await sendImageCarouselTemplate(client, replyToken);
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
        await sendButtonTemplate(client, replyToken);
      } else if (text === "確認テンプレート") {
        await sendConfirmTemplate(client, replyToken);
      } else if (text === "カルーセルテンプレート") {
        await sendCarouselTemplate(client, replyToken);
      } else if (text === "画像カルーセル") {
        await sendImageCarouselTemplate(client, replyToken);
      } else if (text === "ログイン") {
        if (userId) await sendLoginForm(client, replyToken, userId);
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