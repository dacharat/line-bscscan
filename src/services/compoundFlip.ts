import { Contract } from "web3-eth-contract";
import { TokenHelper } from "./tokenHelper";
import { toDecimal } from "../utils";
import {
  FlipPoolInfo,
  PoolInfo,
  RewardDetail,
  Staking,
  TokenBalance,
} from "../types";
import { ContractInterface } from "./interfaces/contract";

export class CompoundFlip implements ContractInterface {
  constructor(
    private readonly name: string,
    private readonly contract: Contract,
    private readonly helper: TokenHelper
  ) {}

  getName = (): string => {
    return this.name;
  };

  getStaking = async (
    poolInfos: PoolInfo[],
    address: string
  ): Promise<Staking[]> => {
    const staking = await this.getInfo(poolInfos, address);
    return [staking].filter((s) => s.tokenBalance > 0);
  };

  getInfo = async (
    poolInfos: PoolInfo[],
    address: string
  ): Promise<Staking> => {
    const info = await this.contract.methods.info(address).call();
    const poolId = await this.contract.methods.poolId().call();
    const earned = await this.contract.methods.earned(address).call();
    const poolInfo = poolInfos.find(
      (p) => p.poolId === parseInt(poolId)
    ) as FlipPoolInfo;

    const principalBalance: PoolInfo & TokenBalance = {
      ...poolInfo,
      tokenBalance: toDecimal(
        info.principal,
        poolInfo.tokenDecimals
      ).toNumber(),
    };

    const rewardDetail = await this.#getRewardBalance(
      poolInfo,
      earned,
      info.profit
    );

    if (principalBalance.type === "flip") {
      const underlying = await this.helper.getLPUnderlyingBalance(
        principalBalance
      );
      const stakingPrice = await this.helper.getLPStakingPrice(
        principalBalance
      );

      return {
        ...principalBalance,
        ...rewardDetail,
        ...underlying,
        ...stakingPrice,
        rewards: poolInfo.rewards,
      };
    }
  };

  #getRewardBalance = async (
    poolInfo: PoolInfo,
    earned: number,
    profit
  ): Promise<RewardDetail> => {
    if (poolInfo.type !== "flip") {
      return null;
    }
    const earnedBalance: PoolInfo & TokenBalance = {
      ...poolInfo,
      tokenBalance: toDecimal(earned * 0.7, poolInfo.tokenDecimals).toNumber(),
    };

    const underlying = await this.helper.getLPUnderlyingBalance(earnedBalance);
    const stakingPrice = await this.helper.getLPStakingPrice(earnedBalance);

    const staking = {
      rewardBalance: earnedBalance.tokenBalance,
      rewardPrice:
        underlying.token0Balance * stakingPrice.token0Price +
        underlying.token1Balance * stakingPrice.token1Price,
    };

    const sharkPrice = await this.helper.getPrice(
      "0xf7321385a461c4490d5526d83e63c366b149cb15"
    );
    const sharkBalance = toDecimal(profit.shark, 18).toNumber();

    return {
      rewardDetail: {
        [poolInfo.lpAddress]: {
          rewardBalance: staking.rewardBalance,
          rewardPrice: staking.rewardPrice,
        },
        "0xf7321385a461c4490d5526d83e63c366b149cb15": {
          rewardBalance: sharkBalance,
          rewardPrice: sharkBalance * sharkPrice,
        },
      },
    };
  };
}
