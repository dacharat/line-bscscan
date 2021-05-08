import { Client, Message } from "@line/bot-sdk";
import axios from "axios";

const pushUrl = `${process.env.LINE_HOST}${process.env.LINE_PUSH_ENDPOINT}`;
const ACCRSS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const RETRY_SENDFLEX = parseInt(process.env.RETRY_SENDFLEX) || 3;

export class LineService {
  constructor(
    private readonly client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    })
  ) {}

  replyMessage = async (
    token: string,
    message: Message | any,
    errorMessage?: Message | any
  ): Promise<void> => {
    for (let i = 0; i < RETRY_SENDFLEX; i++) {
      try {
        await this.client.replyMessage(token, message);
        return;
      } catch (e) {
        continue;
      }
    }

    if (errorMessage) {
      await this.client.replyMessage(token, errorMessage);
    }
  };

  pushMessage = async (
    data: Message | any,
    errorMessage?: Message | any
  ): Promise<void> => {
    const body = {
      to: process.env.LINE_USER_ID,
      messages: [data],
    };

    try {
      await axios.post(pushUrl, body, {
        headers: {
          Authorization: `Bearer ${ACCRSS_TOKEN}`,
        },
      });
      return;
    } catch (e) {
      console.log(`pushMessage: ${e}`);
    }

    if (errorMessage) {
      await axios.post(
        pushUrl,
        {
          to: process.env.LINE_USER_ID,
          messages: [errorMessage],
        },
        {
          headers: {
            Authorization: `Bearer ${ACCRSS_TOKEN}`,
          },
        }
      );
    }
  };
}
