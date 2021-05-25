import { PoolInfo } from "../../types";

export const pools: PoolInfo[] = [
  {
    poolId: 251,
    lpAddress: "0x0ed7e52944161450477ee417de9cd3a859b14fd0",
    tokenDecimals: 18,
    token0Address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    token0Symbol: "Cake",
    token0Decimals: 18,
    token0Logo:
      "https://assets.coingecko.com/coins/images/12632/large/IMG_0440.PNG?1602654093",
    token1Address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    token1Symbol: "WBNB",
    token1Decimals: 18,
    token1Logo:
      "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615",
    rewards: [
      {
        address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
        decimals: 18,
        logo: "https://autoshark.finance/images/pools/pantherxbusd.png",
        symbol: "CAKE",
      },
      {
        address: "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
        decimals: 18,
        logo: "https://assets.coingecko.com/coins/images/13148/large/kZwE0Xor_400x400.jpg?1605682082",
        symbol: "BUNNY",
      },
    ],
    type: "flip",
  },
];
