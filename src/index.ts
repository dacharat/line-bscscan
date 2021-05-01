import "dotenv/config";

import { Masterchef, getPositions } from "./services/masterchef";
import {
  addressBar,
  poolLine,
  summary,
  tableHeader,
  walletLine,
} from "./views/flexTemplate";
import { get, sortBy } from "lodash";
import { isValidAddress, shortenAddress } from "./utils";

import { Client } from "@line/bot-sdk";
import MasterChef from "./abi/MasterChef.json";
import { PriceService } from "./services/priceService";
import { TokenHelper } from "./services/tokenHelper";
import { Web3Service } from "./services/web3Service";
import express from "express";
import { pools } from "./constants/pools";
import axios from "axios";

// Init Express
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

console.log("==========> ", process.env.LINE_CHANNEL_ACCESS_TOKEN);
const ACCRSS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
// Init LINE SDK
const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

// Init Masterchef
const web3Service = new Web3Service();
const priceService = new PriceService();
const masterchefAddress = "0x73feaa1eE314F8c655E354234017bE2193C9E24E";
const contract = web3Service.getContract(MasterChef.abi, masterchefAddress);
const helper = new TokenHelper(web3Service, priceService);
const masterchef = new Masterchef(contract, helper);

// Webhook
app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const eventType = get(event, ["message", "type"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  // Validate input message
  if (eventType !== "text" || !isValidAddress(message)) {
    await lineClient.replyMessage(replyToken, {
      type: "text",
      text:
        "Please input valid BSC address. For example, 0x3c74c735b5863c0baf52598d8fd2d59611c8320f 🐳",
    } as any);
    return res.sendStatus(200);
  }

  // Get poolInfos and store it to fetch faster
  // const pools = await masterchef.getPoolInfos();

  const address = message;
  const stakings = await masterchef.getStaking(pools, address);
  const positions = sortBy(
    stakings.map((stake) => getPositions(stake)),
    ["totalValue"]
  ).reverse();
  const totalValue = positions.reduce(
    (sum, position) => sum + position.totalValue,
    0
  );

  await lineClient.replyMessage(replyToken, {
    type: "flex",
    altText: "Pancake Staking",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          addressBar(shortenAddress(address)),
          tableHeader("Pool"),
          ...positions.map((position) => poolLine(position)),
          summary(totalValue),
        ],
      },
    },
  } as any);
  return res.sendStatus(200);
});

app.get("/test/:id", async (req, res) => {
  const address = req.params.id;
  const stakings = await masterchef.getStaking(pools, address);
  const positions = sortBy(
    stakings.map((stake) => getPositions(stake)),
    ["totalValue"]
  ).reverse();

  const walletTokens = await web3Service.getWalletBalance(address);

  const totalValue =
    positions.reduce((sum, position) => sum + position.totalValue, 0) +
    walletTokens.reduce((sum, token) => sum + token.totalPrice, 0);

  const data = {
    type: "flex",
    altText: "Pancake Staking",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          addressBar(shortenAddress(address)),
          tableHeader("Wallet"),
          ...walletTokens.map(walletLine),
          tableHeader("Pool"),
          ...positions.map((position) => poolLine(position)),
          summary(totalValue),
        ],
      },
    },
  };

  const body = {
    to: process.env.LINE_USER_ID,
    messages: [data],
  };

  const URL = "https://api.line.me/v2/bot/message/push";

  axios.post(URL, body, {
    headers: {
      Authorization: `Bearer ${ACCRSS_TOKEN}`,
    },
  });

  res.status(200).send({ data });
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

// const test = async () => {
//   const address = "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3";
//   const s = await web3Service.getWalletBalance(address);
//   // try {
//   //   const poolsFetch = await masterchef.getPoolInfos();
//   //   console.log(poolsFetch);
//   // } catch (e) {
//   //   console.log(e);
//   // }
//   console.log(s);
// };

// test().then((_) => console.log("done"));
