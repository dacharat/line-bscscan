import { Client, Message } from "@line/bot-sdk";
import axios from "axios";

const pushUrl = `${process.env.LINE_HOST}${process.env.LINE_PUSH_ENDPOINT}`;
const ACCRSS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

export class LineService {
  constructor(
    private readonly client = new Client({
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    })
  ) {}

  replyMessage = async (token: string, message: Message | any) => {
    this.client.replyMessage(token, message);
  };

  pushMessage = async (data: Message | any) => {
    const body = {
      to: process.env.LINE_USER_ID,
      messages: [data],
    };
    axios.post(pushUrl, body, {
      headers: {
        Authorization: `Bearer ${ACCRSS_TOKEN}`,
      },
    });
  };
}
