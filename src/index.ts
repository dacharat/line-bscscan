import "dotenv/config";
import { get } from "lodash";
import express from "express";

import {
  addressBar,
  errorMessage,
  poolLine,
  summary,
  tableHeader,
  walletLine,
  separator,
  errorFlex,
} from "./views/flexTemplate";
import { isValidAddress, shortenAddress } from "./utils";
import { StakingResult } from "./types";

import { PriceService } from "./services/priceService";
import { TokenHelper } from "./services/tokenHelper";
import { Web3Service } from "./services/web3Service";
import { LineService } from "./services/line";
import { DeFiService } from "./services/defi";
import { WalletService } from "./services/wallet";

// Init Express
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Init Service
const lineService = new LineService();
const web3Service = new Web3Service();
const priceService = new PriceService();
const helper = new TokenHelper(web3Service, priceService);
const defiService = new DeFiService(web3Service, helper);
const walletService = new WalletService(web3Service, priceService);

// Webhook;
app.post("/webhook", async (req, res) => {
  const event = get(req, ["body", "events", "0"]);
  const eventType = get(event, ["message", "type"]);
  const message = get(event, ["message", "text"]);
  const replyToken = get(event, "replyToken") as string;

  // Validate input message
  if (eventType !== "text" || !isValidAddress(message)) {
    await lineService.replyMessage(replyToken, {
      type: "text",
      text:
        "Please input valid BSC address. For example, 0x3c74c735b5863c0baf52598d8fd2d59611c8320f 🐳",
    });
    return res.sendStatus(200);
  }

  const address = message;

  const data = await buildFlexTemplate(address);

  await lineService.replyMessage(replyToken, data);

  return res.sendStatus(200);
});

app.get("/test/:id", async (req, res) => {
  const address = req.params.id;

  const data = await buildFlexTemplate(address);

  lineService.pushMessage(data);

  res.status(200).send({ message: "succeess" });
});

const buildFlexTemplate = async (address: string) => {
  try {
    const allStaking = await defiService.getAllStaking(address);

    const totalPositionValue = allStaking?.reduce(
      (sum, staking) =>
        sum +
        (!staking.error
          ? staking.positions.reduce(
              (s, position) => s + position.totalValue,
              0
            )
          : sum),
      0
    );

    const walletTokens = await walletService.getWalletBalance(address);

    const totalValue =
      totalPositionValue +
      walletTokens.reduce((sum, token) => sum + token?.totalValue, 0);

    return {
      type: "flex",
      altText: "Your BSC asset!!",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            addressBar(shortenAddress(address)),
            tableHeader("Wallet"),
            ...walletTokens.map(walletLine),
            separator(),
            ...generateFlex(allStaking).flat(),
            summary(totalValue),
          ],
        },
      },
    };
  } catch (e) {
    return errorFlex(address);
  }
};

const generateFlex = (staking: StakingResult[]) => {
  return staking.map((s) => {
    if (s.error) {
      return [tableHeader(s.name), errorMessage(s.message)];
    }
    if (s.positions.length === 0) {
      return [];
    }
    return [
      tableHeader(s.name),
      ...s.positions.map((position) => poolLine(position)),
    ];
  });
};

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

// const test = async () => {
//   const address = "0x7b77C877B4396d707159baf62af3E667B4e845b6";
//   const s = await web3Service.getWalletBalance(address);
//   // const stakings = await finixMasterChef.getStaking(finixPools, address);
//   const a = await web3Service.web3.eth.getAccounts();

//   console.log(s);
//   console.log(a);
// };

// test().then((_) => console.log("done"));
