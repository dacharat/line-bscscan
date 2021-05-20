import { partition, sortBy } from "lodash";
import { defi } from "../constants/defi";
import { StakingResult } from "../types";
import { rejectAfterDelay } from "../utils";
import { CompoundFlip } from "./compoundFlip";
import { ContractInterface } from "./interfaces/contract";
import { getPositions, Masterchef } from "./masterchef";
import { TokenHelper } from "./tokenHelper";
import { Web3Service } from "./web3Service";

export class DeFiService {
  private contracts: ContractInterface[];

  constructor(
    private readonly web3Service: Web3Service,
    private readonly helper: TokenHelper
  ) {
    this.contracts = Object.keys(defi).map((name) => this.#getMasterChef(name));
  }

  getAllStaking = async (address: string): Promise<StakingResult[]> => {
    const promises = await Promise.allSettled(
      this.contracts.map((contract) =>
        Promise.race([
          this.#getStakingPosition(address, contract),
          rejectAfterDelay(
            this.#getStakingPositionRejectReason(
              "Pool",
              "Time out getStakingPosition"
            )
          ),
        ])
      )
    );

    const [stakings, errors] = partition(
      promises.map((promise) =>
        promise.status === "fulfilled"
          ? (promise as PromiseFulfilledResult<StakingResult> | undefined)
              ?.value
          : promise?.reason
      ) as StakingResult[],
      (result) => !result.error
    );

    return [...sortBy(stakings, ["totalValue"]).reverse(), ...errors];
  };

  #getStakingPosition = async (
    address: string,
    contract: ContractInterface
  ): Promise<StakingResult> => {
    const name = contract.getName();
    const poolName = `${name.toUpperCase()} pool`;
    try {
      const stakings = await contract.getStaking(defi[name].pools, address);
      const positions = sortBy(
        stakings.map((stake) => getPositions(stake)),
        ["totalValue"]
      ).reverse();

      return {
        name: poolName,
        positions,
        totalValue: positions.reduce(
          (sum, position) => sum + position.totalValue,
          0
        ),
      };
    } catch (e) {
      console.log(`getStakingPosition: ${e}`);
      return this.#getStakingPositionRejectReason(poolName, "getStaking");
    }
  };

  #getStakingPositionRejectReason = (
    name: string,
    message: string
  ): StakingResult => ({
    name,
    error: true,
    message: `Defi Service Error: ${message}`,
    positions: [],
    totalValue: 0,
  });

  #getMasterChef = (name: string): ContractInterface => {
    const { abi, address, type } = defi[name];
    const contract = this.web3Service.getContract(abi, address);

    if (type === "automate") {
      return new CompoundFlip(name, contract, this.helper);
    }
    return new Masterchef(name, contract, this.helper);
  };
}
