import {
  FlipStaking,
  LPPoolInfo,
  LPStaking,
  PoolInfo,
  Position,
  RewardBalance,
  SinglePoolInfo,
  SingleStaking,
  Staking,
  TokenBalance,
} from "../types";

import { Contract } from "web3-eth-contract";
import { TokenHelper } from "./tokenHelper";
import { getTokenData } from "../constants/coingecko";
import { isEmpty } from "lodash";
import { toDecimal } from "../utils";
import { ContractInterface } from "./interfaces/contract";

export class Masterchef implements ContractInterface {
  constructor(
    private readonly name: string,
    private readonly masterchef: Contract,
    private readonly helper: TokenHelper
  ) {}

  getName = (): string => {
    return this.name;
  };

  getPoolInfos = async (): Promise<(LPPoolInfo | SinglePoolInfo)[]> => {
    const rewardAddress = (
      await this.masterchef.methods[this.name]().call()
    ).toLowerCase();

    const rewardSymbol = await this.helper.getTokenSymbol(rewardAddress);
    const rewardDecimals = await this.helper.getTokenDecimals(rewardAddress);
    const rewardLogo = getTokenData(rewardAddress)?.logo;
    const poolLength = parseInt(
      await this.masterchef.methods.poolLength().call()
    );
    const poolIds = [...Array(poolLength).keys()];
    const poolInfos: (LPPoolInfo | SinglePoolInfo)[] = await Promise.all(
      poolIds.map(async (pid: number) => {
        const pool = await this.masterchef.methods.poolInfo(pid).call();
        const lpAddress = pool.lpToken.toLowerCase();
        let tokenDecimals = 0;
        try {
          tokenDecimals = await this.helper.getTokenDecimals(lpAddress);
        } catch {
          return null; // NOT Token
        }
        try {
          const pair = await this.helper.getTokenPair(lpAddress);

          return {
            poolId: pid,
            lpAddress,
            tokenDecimals,
            token0Address: pair.token0Address,
            token0Symbol: pair.token0Symbol,
            token0Decimals: pair.token0Decimals,
            token0Logo: getTokenData(pair.token0Address)?.logo,
            token1Address: pair.token1Address,
            token1Symbol: pair.token1Symbol,
            token1Decimals: pair.token1Decimals,
            token1Logo: getTokenData(pair.token1Address)?.logo,
            rewardAddress,
            rewardSymbol,
            rewardDecimals,
            rewardLogo,
            type: "lp",
          } as LPPoolInfo | SinglePoolInfo;
        } catch {
          const tokenSymbol = await this.helper.getTokenSymbol(lpAddress);
          return {
            poolId: pid,
            tokenAddress: lpAddress,
            tokenSymbol,
            tokenDecimals,
            tokenLogo: getTokenData(lpAddress)?.logo,
            rewardAddress,
            rewardSymbol,
            rewardDecimals,
            rewardLogo,
            type: "single",
          } as LPPoolInfo | SinglePoolInfo;
        }
      })
    );
    return poolInfos.filter((poolInfo) => !isEmpty(poolInfo));
  };

  getStaking = async (
    poolInfos: PoolInfo[],
    address: string
  ): Promise<Staking[]> => {
    // 1. Get staking balance
    let stakingBalance: (PoolInfo & TokenBalance)[] = await Promise.all(
      poolInfos.map(async (poolInfo) => {
        const balance = await this.#getStakingBalance(poolInfo, address);
        return { ...poolInfo, ...balance };
      })
    );

    // 2. Filter only staked pools
    stakingBalance = stakingBalance.filter(
      (staking) => staking.tokenBalance > 0
    );

    // 3. Get more information about staking
    return Promise.all(
      stakingBalance.map(async (staking) => {
        const reward = await this.#getStakingReward(staking, address);
        const rewardPrice = await this.helper.getRewardPrice(staking);
        switch (staking.type) {
          case "lp":
            const underlying = await this.helper.getLPUnderlyingBalance(
              staking
            );
            const stakingPrice = await this.helper.getLPStakingPrice(staking);
            return {
              ...staking,
              ...reward,
              ...rewardPrice,
              ...underlying,
              ...stakingPrice,
            };
          case "flip":
            return null;
          case "single":
          default:
            const price = await this.helper.getSingleStakingPrice(staking);
            return { ...staking, ...reward, ...rewardPrice, ...price };
        }
      })
    );
  };

  #getStakingBalance = async (
    poolInfo: PoolInfo,
    address: string
  ): Promise<TokenBalance> => {
    if (!poolInfo) {
      return;
    }
    const user = await this.masterchef.methods
      .userInfo(poolInfo.poolId, address)
      .call();

    return {
      tokenBalance: toDecimal(user.amount, poolInfo.tokenDecimals).toNumber(),
    };
  };

  #getStakingReward = async (
    poolInfo: PoolInfo,
    address: string
  ): Promise<RewardBalance> => {
    if (poolInfo.type === "flip") {
      return null;
    }
    const fnName = `pending${this.name[0].toUpperCase() + this.name.slice(1)}`;
    const pendingReward = await this.masterchef.methods[fnName](
      poolInfo.poolId,
      address
    ).call();
    return {
      rewardBalance: toDecimal(
        pendingReward,
        poolInfo.rewardDecimals
      ).toNumber(),
    };
  };
}

export const getPositions = (staking: Staking): Position => {
  switch (staking.type) {
    case "lp":
      return lpStakingToPosition(staking);
    case "flip":
      return flipStakingToPosition(staking);
    default:
      return singleStakingToPosition(staking);
  }
};

const singleStakingToPosition = (staking: SingleStaking): Position => {
  const tokensValue = staking.tokenBalance * staking.tokenPrice;
  const rewardsValue = staking.rewardBalance * staking.rewardPrice;
  return {
    tokens: [
      {
        symbol: staking.tokenSymbol,
        address: staking.tokenAddress,
        logo: staking.tokenLogo,
        balance: staking.tokenBalance,
        price: staking.tokenPrice,
      },
    ],
    tokensValue,
    balance: staking.tokenBalance,
    rewards: [
      {
        symbol: staking.rewardSymbol,
        address: staking.rewardAddress,
        logo: staking.rewardLogo,
        balance: staking.rewardBalance,
        price: staking.rewardPrice,
      },
    ],
    rewardsValue,
    totalValue: tokensValue + rewardsValue,
  };
};

const lpStakingToPosition = (staking: LPStaking): Position => {
  const tokensValue =
    staking.token0Balance * staking.token0Price +
    staking.token1Balance * staking.token1Price;
  const rewardsValue = staking.rewardBalance * staking.rewardPrice;
  return {
    tokens: [
      {
        symbol: staking.token0Symbol,
        address: staking.token0Address,
        logo: staking.token0Logo,
        balance: staking.token0Balance,
        price: staking.token0Price,
      },
      {
        symbol: staking.token1Symbol,
        address: staking.token1Address,
        logo: staking.token1Logo,
        balance: staking.token1Balance,
        price: staking.token1Price,
      },
    ],
    tokensValue,
    balance: staking.tokenBalance,
    rewards: [
      {
        symbol: staking.rewardSymbol,
        address: staking.rewardAddress,
        logo: staking.rewardLogo,
        balance: staking.rewardBalance,
        price: staking.rewardPrice,
      },
    ],
    rewardsValue,
    totalValue: tokensValue + rewardsValue,
  };
};

const flipStakingToPosition = (staking: FlipStaking): Position => {
  const tokensValue =
    staking.token0Balance * staking.token0Price +
    staking.token1Balance * staking.token1Price;
  const rewardsValue = Object.values(staking.rewardDetail).reduce(
    (cur, reward) => cur + reward.rewardBalance * reward.rewardPrice,
    0
  );
  return {
    tokens: [
      {
        symbol: staking.token0Symbol,
        address: staking.token0Address,
        logo: staking.token0Logo,
        balance: staking.token0Balance,
        price: staking.token0Price,
      },
      {
        symbol: staking.token1Symbol,
        address: staking.token1Address,
        logo: staking.token1Logo,
        balance: staking.token1Balance,
        price: staking.token1Price,
      },
    ],
    tokensValue,
    balance: staking.tokenBalance,
    rewards: staking.rewards.map((reward) => ({
      symbol: reward.symbol,
      address: reward.address,
      logo: reward.logo,
      balance: staking.rewardDetail[reward.address].rewardBalance,
      price: staking.rewardDetail[reward.address].rewardPrice,
    })),
    rewardsValue,
    totalValue: tokensValue + rewardsValue,
  };
};
