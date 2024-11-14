import { WebhookEvent, Client, MessageAPIResponseBase, TextMessage } from "@line/bot-sdk";
import { 
  sendButtonTemplate, 
  sendConfirmTemplate, 
  sendCarouselTemplate, 
  sendImageCarouselTemplate, 
  sendLoginForm,
  lineProductCarousel,
  lineLinkButton,
  lineOrderConfirm,
  lineStatusMessageNormal,
  lineStatusMessageCancel
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
    const source = event.source;

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
      } else if (text === "Line Product Carousel") {
        await lineProductCarousel(client, replyToken);
      } else if (text === "Line Link Button") {
        await lineLinkButton(client, replyToken);
      } else if (text === "Line Order Confirm") {
        await lineOrderConfirm(client, replyToken);
      } else if (text === "Line Status Message 通常") {
        await lineStatusMessageNormal(client, replyToken);
      } else if (text === "Line Status Message キャンセル") {
        await lineStatusMessageCancel(client, replyToken);
      } else if (text === "ログイン") {
        if (userId) await sendLoginForm(client, replyToken, userId);
        else console.error("ユーザーIDが取得できませんでした");
      } else if (text === "rm-test2" && source.userId) {
        try {
          await client.linkRichMenuToUser(source.userId, "richmenu-alias-rm-test2");
          console.log(`Successfully linked rich menu to user ${userId}`);
        } catch (error) {
          const response: TextMessage = {
            type: "text",
            text: "Failed to link rich menu",
          };
          await client.replyMessage(replyToken, response);
        }
      } else {
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