import { Position, StakingResult, WalletToken } from "../types";
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
      weight: "bold",
      color: COLOR.header,
      align: "start",
      contents: [],
    },
    {
      type: "text",
      text: "Value",
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
                  text: position.tokens
                    .map(
                      (token) =>
                        `${formatNumber(token.balance)} ${token.symbol}`
                    )
                    .join(" + "),
                  size: "xs",
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
                  text: `Reward: ${formatNumber(position.reward.balance)} ${
                    position.reward.symbol
                  }`,
                  size: "xs",
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
