import fs from "fs";

import { Masterchef } from "../services/masterchef";
import { PriceService } from "../services/priceService";
import { TokenHelper } from "../services/tokenHelper";
import { Web3Service } from "../services/web3Service";
import { defi } from "../constants/defi";

export const getPoolInfos = async (name: string) => {
  const web3Service = new Web3Service();
  const priceService = new PriceService();
  const masterchefAddress = defi[name].address;
  console.log(masterchefAddress);
  const contract = web3Service.getContract(defi[name].abi, masterchefAddress);
  const helper = new TokenHelper(web3Service, priceService);
  const masterchef = new Masterchef(name, contract, helper);
  try {
    const pools = await masterchef.getPoolInfos();
    writeFile(name, JSON.stringify(pools));
  } catch (error) {
    console.log(error);
  }
};

export const writeFile = (name: string, data: string) => {
  fs.writeFileSync(`${process.env.OUTPUT_PATH}/token-${name}.txt`, data);
};

// getPoolInfos("warden")
//   .then(() => console.log("success"))
//   .catch((e) => console.log(e));
