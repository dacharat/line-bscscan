import { toDecimal } from "../utils";
import { PriceService } from "./priceService";
import { Web3Service } from "./web3Service";
import { WalletToken } from "../types";
import { getTokenData } from "../constants/coingecko";
import Bep20 from "../abi/BEP20.json";
import { whitelist } from "../constants/whitelist";
import { sortBy } from "lodash";

export class WalletService {
  private readonly abi: object;
  private readonly whitelist: string[];

  constructor(
    private readonly web3Service: Web3Service,
    private readonly priceService: PriceService
  ) {
    this.abi = Bep20.abi;
    this.whitelist = whitelist;
  }

  getBnbBalance = async (address: string): Promise<WalletToken> => {
    const {
      id,
      logo,
      decimals,
      symbol,
      name,
      address: tokenAddress,
    } = getTokenData("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c");

    const bnbBalance = await this.web3Service.getBalance(address);
    const formatedBalance = toDecimal(bnbBalance, 18).toNumber();

    return new Promise((resolve) =>
      resolve({
        id,
        logo,
        decimals,
        symbol,
        name,
        address: tokenAddress,
        balance: formatedBalance,
      })
    );
  };

  getBalanceByToken = async (
    address: string,
    token: string
  ): Promise<WalletToken> => {
    const contract = this.web3Service.getContract(this.abi, token);

    const balance = await contract.methods.balanceOf(address).call();
    const {
      id,
      logo,
      decimals,
      symbol,
      name,
      address: tokenAddress,
    } = getTokenData(token);
    const formatedBalance = toDecimal(balance, decimals).toNumber();

    return {
      id,
      logo,
      decimals,
      symbol,
      name,
      address: tokenAddress,
      balance: formatedBalance,
    };
  };

  getWalletBalance = async (address: string): Promise<WalletToken[]> => {
    const promises = await Promise.allSettled([
      this.getBnbBalance(address),
      ...this.whitelist.map((w) => this.getBalanceByToken(address, w)),
    ]);

    const tokens = promises
      .map((promise) =>
        promise.status === "fulfilled"
          ? (promise as PromiseFulfilledResult<WalletToken> | undefined)?.value
          : null
      )
      .filter((token) => token && token.balance > 0);

    const ids = tokens.map((token) => token.id);
    const prices = await this.priceService.getPrices(ids);

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
