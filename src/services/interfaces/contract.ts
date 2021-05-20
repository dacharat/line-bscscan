import { PoolInfo, Staking } from "../../types";

export interface ContractInterface {
  getName: () => string;
  getStaking: (poolInfos: PoolInfo[], address: string) => Promise<Staking[]>;
}
