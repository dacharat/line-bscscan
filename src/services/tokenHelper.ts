import {
  LPBalance,
  LPPoolInfo,
  PoolInfo,
  RewardPrice,
  TokenBalance,
  TokenPair,
  SinglePrice,
  LPPrice,
  WalletToken,
  CoinGeckoResponse,
  SinglePoolInfo,
  FlipPoolInfo,
} from "../types";

import BEP20 from "../abi/BEP20.json";
import FarmsPair from "../abi/FarmsPair.json";
import { PriceService } from "./priceService";
import { Web3Service } from "./web3Service";
import { toDecimal } from "../utils";
import { getTokenData } from "../constants/coingecko";
import { stableCoinLp, unlistedCoingeckoToken } from "../constants/whitelist";

import { partition } from "lodash";

export class TokenHelper {
  constructor(
    private readonly web3Service: Web3Service,
    private readonly priceService: PriceService
  ) {}

  //   BEP20
  getTokenSymbol = async (address: string): Promise<string> => {
    const tokenContract = this.web3Service.getContract(BEP20.abi, address);
    return tokenContract.methods.symbol().call();
  };

  getTokenDecimals = async (address: string): Promise<number> => {
    const tokenContract = this.web3Service.getContract(BEP20.abi, address);
    const tokenDecimals = await tokenContract.methods.decimals().call();
    return parseInt(tokenDecimals);
  };

  //   Pair
  getTokenPair = async (lpAddress: string): Promise<TokenPair> => {
    const lpContract = this.web3Service.getContract(FarmsPair.abi, lpAddress);
    const token0Address = (
      await lpContract.methods.token0().call()
    ).toLowerCase();
    const token1Address = (
      await lpContract.methods.token1().call()
    ).toLowerCase();
    const token0Symbol = await this.getTokenSymbol(token0Address);
    const token0Decimals = await this.getTokenDecimals(token0Address);
    const token1Symbol = await this.getTokenSymbol(token1Address);
    const token1Decimals = await this.getTokenDecimals(token1Address);
    return {
      token0Symbol,
      token0Address,
      token0Decimals,
      token1Symbol,
      token1Address,
      token1Decimals,
    };
  };

  getLPUnderlyingBalance = async (
    poolInfo: (LPPoolInfo | FlipPoolInfo) & TokenBalance
  ): Promise<LPBalance> => {
    const lpContract = this.web3Service.getContract(
      FarmsPair.abi,
      poolInfo.lpAddress
    );
    const totalSupply = toDecimal(
      await lpContract.methods.totalSupply().call(),
      poolInfo.tokenDecimals
    ).toNumber();
    const reserve = await lpContract.methods.getReserves().call();
    const reserve0 = toDecimal(
      reserve._reserve0,
      poolInfo.token0Decimals
    ).toNumber();
    const reserve1 = toDecimal(
      reserve._reserve1,
      poolInfo.token1Decimals
    ).toNumber();
    const share = poolInfo.tokenBalance / totalSupply;
    const token0Balance = share * reserve0;
    const token1Balance = share * reserve1;
    return {
      totalSupply,
      reserve0,
      reserve1,
      token0Balance,
      token1Balance,
    };
  };

  //   Price
  getRewardPrice = async (poolInfo: PoolInfo): Promise<RewardPrice> => {
    if (poolInfo.type === "flip") {
      return null;
    }
    const rewardPrice = await this.getPrice(poolInfo.rewardAddress);
    return {
      rewardPrice,
    };
  };

  getSingleStakingPrice = async (
    poolInfo: SinglePoolInfo
  ): Promise<SinglePrice> => {
    let tokenPrice = 0;
    if (stableCoinLp.includes(poolInfo.tokenAddress)) {
      tokenPrice = 1;
    } else {
      tokenPrice = await this.getPrice(poolInfo.tokenAddress);
    }

    return {
      tokenPrice,
    };
  };

  getLPStakingPrice = async (
    poolInfo: LPPoolInfo | FlipPoolInfo
  ): Promise<LPPrice> => {
    let [token0Price, token1Price] = await Promise.all([
      this.getPrice(poolInfo.token0Address),
      this.getPrice(poolInfo.token1Address),
    ]);
    return {
      token0Price,
      token1Price,
    };
  };

  #getPriceFromFarmsPair = async (address: string): Promise<number> => {
    const lpAddress = getTokenData(address)?.lpPair;
    if (!lpAddress) {
      return 0;
    }

    const lpContract = this.web3Service.getContract(FarmsPair.abi, lpAddress);

    const token0Address = await lpContract.methods.token0().call();
    const reserve = await lpContract.methods.getReserves().call();

    if (this.#isBUSD(token0Address)) {
      return reserve._reserve0 / reserve._reserve1;
    }
    return reserve._reserve1 / reserve._reserve0;
  };

  getPrice = async (address: string): Promise<number> => {
    if (unlistedCoingeckoToken.includes(address)) {
      return this.#getPriceFromFarmsPair(address);
    }
    return this.priceService.getPrice(address);
  };

  getPrices = async (walletToken: WalletToken[]) => {
    const [coingeckoListed, coingeckoUnlisted] = partition(
      walletToken,
      (w) => !unlistedCoingeckoToken.includes(w.address)
    );
    const coingeckoPrices = await this.priceService.getPrices(
      coingeckoListed.map((p) => p.id)
    );

    const farmsPairPrices = await Promise.all(
      coingeckoUnlisted.map(async (r) => ({
        key: r.id,
        value: { usd: await this.#getPriceFromFarmsPair(r.address) },
      }))
    );

    const prices: CoinGeckoResponse = farmsPairPrices.reduce((cur, id) => {
      cur[id.key] = id.value;
      return cur;
    }, {});

    return { ...coingeckoPrices, ...prices };
  };

  #isBUSD = (address: string): boolean => {
    return address === "0xe9e7cea3dedca5984780bafc599bd69add087d56";
  };
}
