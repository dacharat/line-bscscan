import { Contract } from "web3-eth-contract";

import { TokenHelper } from "./tokenHelper";
import { toDecimal } from "../utils";
import {
  FlipPoolInfo,
  IDefiValue,
  PoolInfo,
  RewardDetail,
  Staking,
  TokenBalance,
} from "../types";
import { ContractInterface } from "./interfaces/contract";
import { getTokenData, Token } from "../constants/coingecko";
import { Web3Service } from "./web3Service";

export class CompoundFlip implements ContractInterface {
  private readonly performanceToken: Token;
  constructor(
    private readonly name: string,
    private readonly helper: TokenHelper,
    private readonly value: IDefiValue,
    private readonly web3Service: Web3Service
  ) {
    this.performanceToken = getTokenData(this.value.performance.tokenAddress);
  }

  getName = (): string => {
    return this.name;
  };

  getStaking = async (
    poolInfos: PoolInfo[],
    address: string
  ): Promise<Staking[]> => {
    const result = await Promise.all(
      poolInfos.map((pool) => {
        const contract = this.web3Service.getContract(
          this.value.abi,
          this.value.address
        );

        return this.getInfo(pool as FlipPoolInfo, address, contract);
      })
    );
    return result.filter((s) => s.tokenBalance > 0);
  };

  getInfo = async (
    poolInfo: FlipPoolInfo,
    address: string,
    contract: Contract
  ): Promise<Staking> => {
    const info = await contract.methods.info(address).call();
    const earned = await contract.methods.earned(address).call();

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
      info.profit[this.performanceToken.symbol.toLowerCase()]
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
    profit: number
  ): Promise<RewardDetail> => {
    if (poolInfo.type !== "flip") {
      return null;
    }

    const remainingReward = 1 - this.value.performance.feePercentage / 100;

    const earnedBalance: PoolInfo & TokenBalance = {
      ...poolInfo,
      tokenBalance: toDecimal(
        earned * remainingReward,
        poolInfo.tokenDecimals
      ).toNumber(),
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
      this.value.performance.tokenAddress
    );
    const sharkBalance = toDecimal(
      profit,
      this.performanceToken.decimals
    ).toNumber();

    return {
      rewardDetail: {
        [poolInfo.lpAddress]: {
          rewardBalance: staking.rewardBalance,
          rewardPrice: staking.rewardPrice,
        },
        [this.value.performance.tokenAddress]: {
          rewardBalance: sharkBalance,
          rewardPrice: sharkBalance * sharkPrice,
        },
      },
    };
  };
}
