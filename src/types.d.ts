export type SinglePoolInfo = {
  poolId: number;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenLogo: string;
  rewardAddress: string;
  rewardSymbol: string;
  rewardDecimals: number;
  rewardLogo: string;
  type: "single";
};

export type LPPoolInfo = TokenPair & {
  poolId: number;
  lpAddress: string;
  tokenDecimals: number;
  token0Logo: string;
  token1Logo: string;
  rewardAddress: string;
  rewardSymbol: string;
  rewardDecimals: number;
  rewardLogo: string;
  type: "lp";
};

export type TokenPair = {
  token0Address: string;
  token0Symbol: string;
  token0Decimals: number;
  token1Address: string;
  token1Symbol: string;
  token1Decimals: number;
};

export type PoolInfo = SinglePoolInfo | LPPoolInfo;

export type TokenBalance = {
  tokenBalance: number;
};

export type RewardBalance = {
  rewardBalance: number;
};

export type LPBalance = {
  totalSupply: number;
  reserve0: number;
  reserve1: number;
  token0Balance: number;
  token1Balance: number;
};

export type LPPrice = {
  token0Price: number;
  token1Price: number;
};

export type SinglePrice = {
  tokenPrice: number;
};

export type RewardPrice = {
  rewardPrice: number;
};

export type SingleStaking = SinglePoolInfo &
  TokenBalance &
  RewardBalance &
  RewardPrice &
  SinglePrice;

export type LPStaking = LPPoolInfo &
  TokenBalance &
  RewardBalance &
  RewardPrice &
  LPBalance &
  LPPrice;

export type Staking = SingleStaking | LPStaking;

export type Token = {
  symbol: string;
  address: string;
  logo: string;
  balance: number;
  price?: number;
};

export type Position = {
  tokens: Token[];
  balance: number;
  reward?: Token;
  totalValue: number;
};

export type CoinGeckoResponse = { [key: string]: { usd: number } };

export type StakingResult = {
  name: string;
  positions: Position[];
  error?: boolean;
  message?: string;
};

export type WalletToken = Token & {
  id: string;
  decimals: number;
  name: string;
  totalValue?: number;
};

export type WalletBalance = {
  walletTokens: WalletToken[];
  totalValue: number;
};

export type IDefiValue = {
  address: string;
  abi: object;
  pools: PoolInfo[];
};

export type IDefi = {
  [key: string]: IDefiValue;
};
