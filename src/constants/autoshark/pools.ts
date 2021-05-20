import { PoolInfo } from "../../types";

export const pools: PoolInfo[] = [
  {
    poolId: 16,
    lpAddress: "0x9287f5ad55d7ee8eae90b865718eb9a7cf3fb71a",
    tokenDecimals: 18,
    token0Address: "0x1f546ad641b56b86fd9dceac473d1c7a357276b7",
    token0Symbol: "PANTHER",
    token0Decimals: 18,
    token0Logo:
      "https://assets.coingecko.com/coins/images/15130/small/panther.PNG?1619764096",
    token1Address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    token1Symbol: "BUSD",
    token1Decimals: 18,
    token1Logo:
      "https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766",
    rewards: [
      {
        address: "0x9287f5ad55d7ee8eae90b865718eb9a7cf3fb71a",
        decimals: 18,
        logo: "https://autoshark.finance/images/pools/pantherxbusd.png",
        symbol: "PANTHER-BUSD",
      },
      {
        address: "0xf7321385a461c4490d5526d83e63c366b149cb15",
        decimals: 18,
        logo: "https://firebasestorage.googleapis.com/v0/b/ape-board-prod.appspot.com/o/logo%2Fautoshark.png?alt=media&token=a4349ec9-dce5-4bcf-95c2-3a565d09d00e",
        symbol: "SHARK",
      },
    ],
    type: "flip",
  },
];
