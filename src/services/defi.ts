import { sortBy } from "lodash";
import { defi } from "../constants/defi";
import { Position } from "../types";
import { getPositions, Masterchef } from "./masterchef";
import { TokenHelper } from "./tokenHelper";
import { Web3Service } from "./web3Service";

export const getMasterChef = (
  web3Service: Web3Service,
  helper: TokenHelper,
  name: string
): Masterchef => {
  const masterChefAddress = defi[name].address;
  const contract = web3Service.getContract(defi[name].abi, masterChefAddress);
  return new Masterchef(name, contract, helper);
};

const getStakingPosition = async (
  address: string,
  masterchef: Masterchef
): Promise<Position[]> => {
  const stakings = await masterchef.getStaking(
    defi[masterchef.getName()].pools,
    address
  );
  return sortBy(
    stakings.map((stake) => getPositions(stake)),
    ["totalValue"]
  ).reverse();
};

export const getAllStaking = async (
  address: string,
  ...masterchefs: Masterchef[]
) => {
  const promises = await Promise.allSettled(
    masterchefs.map((masterchef) => getStakingPosition(address, masterchef))
  );

  return promises.map((promise) =>
    promise.status === "fulfilled"
      ? (promise as PromiseFulfilledResult<Position[]> | undefined)?.value
      : []
  );
};
