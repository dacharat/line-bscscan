import Web3 from "web3";

import Safemoon from "../abi/safemoon/abi.json";
import { WalletToken } from "../types";
import { PriceService } from "./priceService";
import { toDecimal } from "../utils";

// You can use any RPC endpoint from
// https://docs.binance.org/smart-chain/developer/rpc.html
// const BSC_RPC = "https://bsc-dataseed1.defibit.io/";
const BSC_RPC = "https://bsc-dataseed.binance.org/";

export class Web3Service {
  web3: Web3;
  priceService: PriceService;

  constructor() {
    this.priceService = new PriceService();
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(BSC_RPC, { keepAlive: true })
    );
  }

  getContract = (abi: any, address: string) => {
    return new this.web3.eth.Contract(abi, address);
  };

  getBalance = (address: string) => {
    return this.web3.eth.getBalance(address);
  };

  getSafemoonBalance: (address: string) => Promise<WalletToken> = async (
    address
  ) => {
    const abi = Safemoon.abi as any;
    const contract = new this.web3.eth.Contract(
      abi,
      "0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3"
    );
    const promises = await Promise.allSettled([
      { decimals: await contract.methods.decimals().call() },
      { balance: await contract.methods.balanceOf(address).call() },
      { symbol: await contract.methods.symbol().call() },
      { name: await contract.methods.name().call() },
    ]);

    const token = promises.map((promise) =>
      promise.status === "fulfilled"
        ? (promise as PromiseFulfilledResult<object> | undefined)?.value
        : null
    );
    const o = Object.assign({}, ...token) as WalletToken;
    const data = await this.priceService.getPrices([o.name]);
    console.log(data);

    return o;
  };

  getBnbBalance: (address: string) => Promise<WalletToken> = async (
    address
  ) => {
    const bnbBalance = await this.web3.eth.getBalance(address);
    console.log(toDecimal(bnbBalance, 18).toNumber());

    return new Promise((resolve) =>
      resolve({
        balance: bnbBalance,
        decimals: 18,
        symbol: "BNB",
        name: "binancecoin",
      })
    );
  };

  getWalletBalance: (address: string) => Promise<WalletToken[]> = async (
    address
  ) => {
    const promises = await Promise.allSettled([
      this.getBnbBalance(address),
      this.getSafemoonBalance(address),
    ]);

    return promises.map((promise) =>
      promise.status === "fulfilled"
        ? (promise as PromiseFulfilledResult<WalletToken> | undefined)?.value
        : null
    );
  };
}
