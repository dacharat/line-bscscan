import { Contract } from "web3-eth-contract";

import {
  FlipPoolInfo,
  IDefiValue,
  PoolInfo,
  RewardDetail,
  Staking,
  TokenBalance,
} from "../../types";
import { toDecimal } from "../../utils";
import { ContractInterface } from "../interfaces/contract";
import { TokenHelper } from "../tokenHelper";
import { Web3Service } from "../web3Service";

// TODO make reward calculate correct
export class PcBunnyCompoundFlip implements ContractInterface {
  private readonly RATIO = 1.7474;
  constructor(
    private readonly name: string,
    private readonly helper: TokenHelper,
    private readonly value: IDefiValue,
    private readonly web3Service: Web3Service
  ) {}

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
    const earned = await contract.methods.earned(address).call();
    const principal = await contract.methods.principalOf(address).call();

    const principalBalance: PoolInfo & TokenBalance = {
      ...poolInfo,
      tokenBalance: toDecimal(principal, poolInfo.tokenDecimals).toNumber(),
    };

    const rewardDetail = await this.#getRewardBalance(poolInfo, earned);

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

    return null;
  };

  #getRewardBalance = async (
    poolInfo: PoolInfo,
    earned: number
  ): Promise<RewardDetail> => {
    if (poolInfo.type !== "flip") {
      return null;
    }

    const earnedFormatted =
      toDecimal(earned, poolInfo.tokenDecimals).toNumber() * this.RATIO;

    const cakePrice = await this.helper.getPrice(poolInfo.rewards[0].address);
    const cakeBalance = earnedFormatted * 0.7;

    const bunnyPrice = await this.helper.getPrice(
      this.value.performance.tokenAddress
    );
    const bunntBalance = (earnedFormatted * 0.3 * cakePrice) / bunnyPrice;

    return {
      rewardDetail: {
        [poolInfo.rewards[0].address]: {
          rewardBalance: cakeBalance,
          rewardPrice: cakePrice,
        },
        [this.value.performance.tokenAddress]: {
          rewardBalance: bunntBalance,
          rewardPrice: bunnyPrice,
        },
      },
    };
  };
}
