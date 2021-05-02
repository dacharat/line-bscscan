import { Position, WalletToken } from "../types";
import { formatNumber } from "../utils";

export const addressBar = (address: string) => ({
  type: "text",
  text: `Address: ${address}`,
  size: "xs",
  color: "#AAAAAA",
  contents: [],
});

export const errorMessage = (message: string) => ({
  type: "text",
  text: message,
  size: "xs",
  color: "#AAAAAA",
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
      color: "#7645D9",
      align: "start",
      contents: [],
    },
    {
      type: "text",
      text: "Value",
      weight: "bold",
      color: "#7645D9",
      align: "end",
      offsetEnd: "6%",
      contents: [],
    },
  ],
});

export const separator = () => ({
  type: "separator",
});

export const summary = (totalValue: number) => ({
  type: "box",
  layout: "horizontal",
  paddingTop: "8px",
  contents: [
    {
      type: "text",
      text: "Total",
      weight: "bold",
      color: "#452A7AFF",
      align: "start",
      contents: [],
    },
    {
      type: "text",
      text: `$${formatNumber(totalValue)}`,
      weight: "bold",
      color: "#452A7A",
      align: "end",
      contents: [],
    },
  ],
});

// export const poolLine = (position: Position) => {
//   return line(position);
// };

// export const walletLine = (wallet: WalletToken) => {
//   return line({
//     tokens: [wallet],
//     totalValue: wallet.totalValue || 0,
//   });
// };

// const line = ({ tokens, totalValue }: ILine) => ({
//   type: "box",
//   layout: "vertical",
//   contents: [
//     {
//       type: "box",
//       layout: "horizontal",
//       paddingTop: "8px",
//       paddingBottom: "8px",
//       contents: [
//         {
//           type: "box",
//           layout: "vertical",
//           flex: 8,
//           backgroundColor: "#FFFFFF00",
//           contents:
//             tokens.length === 1 ? singleToken(tokens[0]) : lpToken(tokens),
//         },
//         {
//           type: "box",
//           layout: "vertical",
//           flex: 4,
//           backgroundColor: "#FFFFFFFF",
//           contents: [
//             {
//               type: "text",
//               text: `$${formatNumber(totalValue)}`,
//               size: "xs",
//               align: "end",
//               offsetTop: "6%",
//               contents: [],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// });

// const singleToken = (token: Token) => [
//   {
//     type: "box",
//     layout: "horizontal",
//     paddingBottom: "4px",
//     contents: [
//       {
//         type: "box",
//         layout: "horizontal",
//         width: "60px",
//         contents: [
//           {
//             type: "image",
//             url: token.logo,
//             size: "30%",
//           },
//         ],
//       },
//       {
//         type: "text",
//         text: `${formatNumber(token.balance)} ${token.symbol.toUpperCase()}`,
//         weight: "regular",
//         size: "sm",
//         align: "start",
//         gravity: "center",
//         offsetStart: "24%",
//         contents: [],
//       },
//     ],
//   },
//   // {
//   //   type: "box",
//   //   layout: "horizontal",
//   //   paddingBottom: "4px",
//   //   contents: [
//   //     {
//   //       type: "text",
//   //       text: `${formatNumber(token.balance)} ${token.symbol.toUpperCase()}`,
//   //       size: "xs",
//   //       align: "start",
//   //       gravity: "center",
//   //       contents: [],
//   //     },
//   //   ],
//   // },
// ];

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
          backgroundColor: "#FFFFFF00",
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
          backgroundColor: "#FFFFFFFF",
          contents: [
            {
              type: "text",
              text: `$${formatNumber(position.totalValue)}`,
              size: "xs",
              align: "end",
              offsetTop: "6%",
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
          backgroundColor: "#FFFFFF00",
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
              contents: [],
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          flex: 4,
          backgroundColor: "#FFFFFFFF",
          contents: [
            {
              type: "text",
              text: `$${formatNumber(wallet.totalValue)}`,
              size: "xs",
              align: "end",
              offsetTop: "6%",
              contents: [],
            },
          ],
        },
      ],
    },
  ],
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
          color: "#ff0000",
        },
        {
          type: "button",
          style: "link",
          action: {
            type: "postback",
            label: "Try again",
            data: `message=${pushbackMessage}`,
          },
        },
      ],
    },
  },
});
