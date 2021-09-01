import { IDefiValue, PoolInfo, Staking } from "../../types";
import { toDecimal } from "../../utils";
import { ContractInterface } from "../interfaces/contract";
import { TokenHelper } from "../tokenHelper";
import { Web3Service } from "../web3Service";

export class AleStakingReward implements ContractInterface {
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
      poolInfos.map(async (pool) => {
        const contract = this.web3Service.getContract(
          this.value.abi,
          this.value.address
        );

        if (pool.type !== "single") {
          return null;
        }

        const balance = await contract.methods.balanceOf(address).call();
        const earned = await contract.methods.earned(address).call();

        const tokenPrice = await this.helper.getPrice(pool.tokenAddress);

        const rewardPrice = await this.helper.getPrice(pool.rewardAddress);

        return {
          ...pool,
          type: "single",
          tokenBalance: toDecimal(balance, pool.tokenDecimals).toNumber(),
          rewardBalance: toDecimal(earned, pool.rewardDecimals).toNumber(),
          rewardPrice,
          tokenPrice,
        } as Staking;
      })
    );
    return result.filter((s) => s.tokenBalance > 0);
  };
}
