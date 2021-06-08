import {
  PoolInfo,
  SinglePoolInfo,
  Staking,
  TokenBalance,
  RewardBalance,
} from "../types";
import { ContractInterface } from "./interfaces/contract";
import { TokenHelper } from "./tokenHelper";
import { Contract } from "web3-eth-contract";

import { toDecimal } from "../utils";

export class Jungle implements ContractInterface {
  constructor(
    private readonly name: string,
    private readonly masterchef: Contract,
    private readonly helper: TokenHelper
  ) {}

  getName = (): string => {
    return this.name;
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
      stakingBalance.map(async (staking: SinglePoolInfo & TokenBalance) => {
        const reward = await this.#getStakingReward(staking, address);
        const rewardPrice = await this.helper.getRewardPrice(staking);

        const price = await this.helper.getSingleStakingPrice(staking);
        return { ...staking, ...reward, ...rewardPrice, ...price };
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
    const user = await this.masterchef.methods.userInfo(address).call();

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
    const pendingReward = await this.masterchef.methods
      .pendingReward(address)
      .call();
    return {
      rewardBalance: toDecimal(
        pendingReward,
        poolInfo.rewardDecimals
      ).toNumber(),
    };
  };
}
