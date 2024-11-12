import {
  middleware,
  MiddlewareConfig,
  WebhookEvent,
  TextMessage,
  MessageAPIResponseBase,
  Client,
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

// MessagingApiClientの代わりにClientを使う
const client = new Client({
  channelAccessToken: env.CHANNEL_ACCESS_TOKEN || "",
});

const app: Application = express();

app.get("/", async (_: Request, res: Response) => {
  res.status(200).send({
    message: "success",
  });
});

const textEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;

  const resText = (() => {
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return text.split("").reverse().join("");
      case 1:
        return text.split("").join(" ");
      default:
        return text.split("").reverse().join(" ");
    }
  })();
  console.log(resText);

  const response: TextMessage = {
    type: "text",
    text: resText,
  };
  await client.replyMessage(replyToken, [response]);
};

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