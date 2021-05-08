import { rejectAfterDelay, toDecimal } from "../utils";
import { Web3Service } from "./web3Service";
import { WalletToken } from "../types";
import { getTokenData } from "../constants/coingecko";
import Bep20 from "../abi/BEP20.json";
import { whitelist } from "../constants/whitelist";
import { sortBy } from "lodash";
import { TokenHelper } from "./tokenHelper";

export class WalletService {
  private readonly abi: object;
  private readonly whitelist: string[];

  constructor(
    private readonly web3Service: Web3Service,
    private readonly tokenHelper: TokenHelper
  ) {
    this.abi = Bep20.abi;
    this.whitelist = whitelist;
  }

  #getBnbBalance = async (userAddress: string): Promise<WalletToken> => {
    const { id, logo, decimals, symbol, name, address } = getTokenData(
      "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
    );

    const bnbBalance = await this.web3Service.getBalance(userAddress);
    const formatedBalance = toDecimal(bnbBalance, 18).toNumber();

    return {
      id,
      logo,
      decimals,
      symbol,
      name,
      address,
      balance: formatedBalance,
    };
  };

  #getBalanceByToken = async (
    userAddress: string,
    tokenAddress: string
  ): Promise<WalletToken> => {
    const contract = this.web3Service.getContract(this.abi, tokenAddress);

    const balance = await contract.methods.balanceOf(userAddress).call();
    const { id, logo, decimals, symbol, name, address } = getTokenData(
      tokenAddress
    );
    const formatedBalance = toDecimal(balance, decimals).toNumber();

    return {
      id,
      logo,
      decimals,
      symbol,
      name,
      address,
      balance: formatedBalance,
    };
  };

  getWalletBalance = async (address: string): Promise<WalletToken[]> => {
    const tasks = [
      this.#getBnbBalance(address),
      ...this.whitelist.map((w) => this.#getBalanceByToken(address, w)),
    ];

    const promises = await Promise.allSettled(
      tasks.map((task) => Promise.race([task, rejectAfterDelay()]))
    );

    const tokens = promises
      .map((promise) =>
        promise.status === "fulfilled"
          ? (promise as PromiseFulfilledResult<WalletToken> | undefined)?.value
          : null
      )
      .filter((token) => token && token.balance > 0);

    const prices = await this.tokenHelper.getPrices(tokens);

    const tokenResult = tokens.map((token) => {
      const price = prices[token.id].usd || 0;
      return { ...token, price, totalValue: token.balance * price };
    });

    return sortBy(
      tokenResult.filter((token) => token && token.totalValue > 0),
      ["totalValue"]
    ).reverse();
  };
}
