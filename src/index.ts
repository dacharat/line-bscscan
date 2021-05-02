import "dotenv/config";

import { getPositions } from "./services/masterchef";
import {
  addressBar,
  poolLine,
  summary,
  tableHeader,
  walletLine,
} from "./views/flexTemplate";
import { get, sortBy } from "lodash";
import { isValidAddress, shortenAddress } from "./utils";

import { PriceService } from "./services/priceService";
import { TokenHelper } from "./services/tokenHelper";
import { Web3Service } from "./services/web3Service";
import { LineService } from "./services/line";
import express from "express";
import { getAllStaking, getMasterChef } from "./services/defi";

import { pools } from "./constants/pancake/pools";

// Init Express
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Init LINE SDK
const lineService = new LineService();

// Init Masterchef
const web3Service = new Web3Service();
const priceService = new PriceService();
const helper = new TokenHelper(web3Service, priceService);

// Init cake masterchhef
const cakeMasterchef = getMasterChef(web3Service, helper, "cake");

// Init definix masterchef
const finixMasterChef = getMasterChef(web3Service, helper, "finix");

// Init panther masterchef
const pantherMasterchef = getMasterChef(web3Service, helper, "panther");

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
  const stakings = await cakeMasterchef.getStaking(pools, address);
  const positions = sortBy(
    stakings.map((stake) => getPositions(stake)),
    ["totalValue"]
  ).reverse();
  const totalValue = positions.reduce(
    (sum, position) => sum + position.totalValue,
    0
  );

  await lineService.replyMessage(replyToken, {
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
  });

  return res.sendStatus(200);
});

app.get("/test/:id", async (req, res) => {
  const address = req.params.id;

  const allPositions = await getAllStaking(
    address,
    cakeMasterchef,
    finixMasterChef,
    pantherMasterchef
  );

  const walletTokens = await web3Service.getWalletBalance(address);

  const totalPositionValue = allPositions?.reduce(
    (sum, positions) =>
      sum + positions.reduce((s, position) => s + position.totalValue, 0),
    0
  );
  const totalValue =
    totalPositionValue +
    walletTokens.reduce((sum, token) => sum + token.totalValue, 0);

  const data = {
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
          tableHeader("Pool"),
          ...allPositions
            .map((positions) => {
              const p = positions.map((position) => poolLine(position));
              return p;
            })
            .flat(),
          summary(totalValue),
        ],
      },
    },
  };

  lineService.pushMessage(data);

  res.status(200).send({});
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

// const test = async () => {
//   const address = "0x7b77C877B4396d707159baf62af3E667B4e845b6";
//   // const s = await web3Service.getWalletBalance(address);
//   const stakings = await finixMasterChef.getStaking(finixPools, address);

//   console.log(stakings);
// };

// test().then((_) => console.log("done"));
