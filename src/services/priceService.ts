import axios, { AxiosInstance } from "axios";
import { tokens } from "../constants/coingecko";
import { CoinGeckoResponse } from "../types";

export class PriceService {
  private readonly coingeckoClient: AxiosInstance;

  constructor() {
    this.coingeckoClient = axios.create({
      baseURL: "https://api.coingecko.com",
      timeout: 7000,
    });
  }
  getPrice = async (address: string): Promise<number> => {
    try {
      let data: CoinGeckoResponse = {};
      let id = "";
      if (address in tokens) {
        id = tokens[address].id;
        const res = await this.coingeckoClient.get(
          `/api/v3/simple/price?ids=${id}&vs_currencies=usd`
        );
        data = res.data;
      }
      return data[id || address]?.usd || 0;
    } catch (e) {
      console.log("Error getting price", e);
    }

    return 0;
  };

  getPrices = async (ids: string[]): Promise<CoinGeckoResponse> => {
    try {
      const { data } = await this.coingeckoClient.get(
        `/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`
      );

      return data as CoinGeckoResponse;
    } catch (e) {
      console.log("Error getting price", e);
    }

    return ids.reduce((cur, id) => {
      cur[id] = { usd: 0 };
      return cur;
    }, {});
  };
}
