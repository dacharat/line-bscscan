import { sortBy } from "lodash";
import { defi } from "../constants/defi";
import { StakingResult } from "../types";
import { getPositions, Masterchef } from "./masterchef";
import { TokenHelper } from "./tokenHelper";
import { Web3Service } from "./web3Service";

export class DeFiService {
  private masterchefs: Masterchef[];

  constructor(
    private readonly web3Service: Web3Service,
    private readonly helper: TokenHelper
  ) {
    this.masterchefs = Object.keys(defi).map((name) =>
      this.#getMasterChef(name)
    );
  }

  getAllStaking = async (address: string): Promise<StakingResult[]> => {
    const promises = await Promise.allSettled(
      this.masterchefs.map((masterchef) =>
        this.#getStakingPosition(address, masterchef)
      )
    );

    return promises.map((promise) =>
      promise.status === "fulfilled"
        ? (promise as PromiseFulfilledResult<StakingResult> | undefined)?.value
        : promise?.reason
    );
  };

  #getStakingPosition = async (
    address: string,
    masterchef: Masterchef
  ): Promise<StakingResult> => {
    const name = masterchef.getName();
    const poolName = `${name.toUpperCase()} pool`;
    try {
      const stakings = await masterchef.getStaking(defi[name].pools, address);
      return {
        name: poolName,
        positions: sortBy(
          stakings.map((stake) => getPositions(stake)),
          ["totalValue"]
        ).reverse(),
      };
    } catch (e) {
      return {
        name: poolName,
        error: true,
        message: `Cannot fetch ${name} pool`,
        positions: [],
      };
    }
  };

  #getMasterChef = (name: string): Masterchef => {
    const masterChefAddress = defi[name].address;
    const contract = this.web3Service.getContract(
      defi[name].abi,
      masterChefAddress
    );
    return new Masterchef(name, contract, this.helper);
  };
}
