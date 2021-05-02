import Web3 from "web3";
import { Contract } from "web3-eth-contract";

// You can use any RPC endpoint from
// https://docs.binance.org/smart-chain/developer/rpc.html
// const BSC_RPC = "https://bsc-dataseed1.defibit.io/";
const BSC_RPC = "https://bsc-dataseed.binance.org/";

export class Web3Service {
  web3: Web3;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(BSC_RPC, { keepAlive: true })
    );
  }

  getContract = (abi: any, address: string): Contract => {
    return new this.web3.eth.Contract(abi, address);
  };

  getBalance = (address: string): Promise<string> => {
    return this.web3.eth.getBalance(address);
  };
}
