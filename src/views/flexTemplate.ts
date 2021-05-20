import { Position, StakingResult, Token, WalletToken } from "../types";
import { formatNumber } from "../utils";

const COLOR = {
  title: "#CCCCCC",
  header: "#436AA9",
  detail: "#f5f7f8",
  error: "#FF0000",
  summary: "#e9edf0",
  separator: "#485869",
};

export const addressBar = (address: string) => ({
  type: "text",
  text: `Address: ${address}`,
  size: "xs",
  color: COLOR.title,
  contents: [],
});

export const errorMessage = (message: string) => ({
  type: "text",
  text: message,
  size: "xs",
  color: COLOR.title,
  contents: [],
});

export const tableHeader = (header: string) => ({
  type: "box",
  layout: "horizontal",
  paddingTop: "8px",
  contents: [
    {
      type: "text",
      text: header,
      flex: 8,
      weight: "bold",
      color: COLOR.header,
      align: "start",
      contents: [],
    },
    {
      type: "text",
      text: "Value",
      flex: 4,
      weight: "bold",
      color: COLOR.header,
      align: "end",
      offsetEnd: "6%",
      contents: [],
    },
  ],
});

export const separator = () => ({
  type: "separator",
  color: COLOR.separator,
  margin: "8px",
});

export const summary = (totalValue: number) => ({
  type: "box",
  layout: "horizontal",
  paddingTop: "8px",
  contents: [
    {
      type: "text",
      text: "Total",
      flex: 4,
      weight: "bold",
      size: "lg",
      color: COLOR.summary,
      align: "start",
      contents: [],
    },
    {
      type: "text",
      text: `$${formatNumber(totalValue)}`,
      flex: 8,
      weight: "bold",
      size: "lg",
      color: COLOR.summary,
      align: "end",
      contents: [],
    },
  ],
});

export const poolLine = (position: Position) => ({
  type: "box",
  layout: "vertical",
  contents: [
    {
      type: "box",
      layout: "horizontal",
      paddingTop: "8px",
      paddingBottom: "8px",
      contents: [
        {
          type: "box",
          layout: "vertical",
          flex: 8,
          contents: [
            {
              type: "box",
              layout: "horizontal",
              paddingBottom: "4px",
              contents: [
                {
                  type: "box",
                  layout: "horizontal",
                  width: "60px",
                  contents: position.tokens.map((token) => ({
                    type: "image",
                    url: token.logo,
                    size: "xxs",
                  })),
                },
                {
                  type: "text",
                  text: position.tokens.map((token) => token.symbol).join("-"),
                  weight: "regular",
                  size: "sm",
                  align: "start",
                  gravity: "center",
                  offsetStart: "24%",
                  color: COLOR.detail,
                  contents: [],
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              paddingBottom: "4px",
              contents: [
                {
                  type: "text",
                  text: getStakingBalance(
                    position.tokens,
                    position.tokensValue
                  ),
                  size: "xxs",
                  wrap: true,
                  align: "start",
                  gravity: "center",
                  color: COLOR.detail,
                  contents: [],
                },
              ],
            },
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: `Reward: ${getStakingBalance(
                    position.rewards,
                    position.rewardsValue
                  )}`,
                  size: "xxs",
                  wrap: true,
                  align: "start",
                  gravity: "center",
                  color: COLOR.detail,
                  contents: [],
                },
              ],
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          flex: 4,
          contents: [
            {
              type: "text",
              text: `$${formatNumber(position.totalValue)}`,
              size: "xs",
              align: "end",
              offsetTop: "6%",
              color: COLOR.detail,
              contents: [],
            },
          ],
        },
      ],
    },
  ],
});

const getStakingBalance = (tokens: Token[], totalValue: number) =>
  `${tokens
    .map((token) => getTokenBalance(token))
    .join(" + ")} ($${formatNumber(totalValue)})`;

const getTokenBalance = (token: Token) =>
  `${formatNumber(token.balance)} ${token.symbol}`;

export const walletLine = (wallet: WalletToken) => ({
  type: "box",
  layout: "vertical",
  contents: [
    {
      type: "box",
      layout: "horizontal",
      paddingTop: "8px",
      paddingBottom: "8px",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          flex: 8,
          paddingBottom: "4px",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              width: "20px",
              contents: [
                {
                  type: "image",
                  url: wallet.logo,
                  size: "xxs",
                },
              ],
            },
            {
              type: "text",
              text: `${formatNumber(
                wallet.balance
              )} ${wallet.symbol.toUpperCase()}`,
              weight: "regular",
              size: "sm",
              align: "start",
              gravity: "center",
              offsetStart: "24%",
              color: COLOR.detail,
              contents: [],
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          flex: 4,
          contents: [
            {
              type: "text",
              text: `$${formatNumber(wallet.totalValue)}`,
              size: "xs",
              align: "end",
              offsetTop: "6%",
              color: COLOR.detail,
              contents: [],
            },
          ],
        },
      ],
    },
  ],
});

export const subTotal = (value: number) => ({
  type: "text",
  text: `$${formatNumber(value)}`,
  size: "sm",
  align: "end",
  weight: "bold",
  color: COLOR.detail,
  contents: [],
});

export const errorFlex = (pushbackMessage: string) => ({
  type: "flex",
  altText: "Failed to get Your BSC asset!!",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "Unable to fetch your assets",
          size: "md",
          color: COLOR.error,
        },
        {
          type: "button",
          style: "link",
          action: {
            type: "message",
            label: "Try again",
            text: pushbackMessage,
          },
        },
      ],
    },
  },
});

export const generateFlex = (staking: StakingResult[]) => {
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
      subTotal(s.totalValue),
      separator(),
    ];
  });
};

const gradientBackground = () => ({
  type: "linearGradient",
  angle: "90deg",
  startColor: "#29323c",
  endColor: "#37434f",
});

// TODO refactor this funciton Ex. bg color
export const dashboardFlex = (contents: any[], address: string) => ({
  type: "flex",
  altText: "Your BSC asset!!",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents,
      background: gradientBackground(),
    },
    footer: footerFlex(address),
  },
});

const footerFlex = (address: string) => ({
  type: "box",
  layout: "vertical",
  contents: [
    {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "button",
          action: {
            type: "uri",
            label: "Transactions",
            uri: `https://bscscan.com/address/${address}`,
          },
          height: "sm",
          color: "#436AA9",
          adjustMode: "shrink-to-fit",
        },
        {
          type: "button",
          action: {
            type: "message",
            label: "Scan again",
            text: address,
          },
          height: "sm",
          color: "#436AA9",
          adjustMode: "shrink-to-fit",
        },
      ],
    },
  ],
  background: gradientBackground(),
});
