import axios from "axios";
import { tokens } from "../constants/coingecko";
import { CoinGeckoResponse } from "../types";

export class PriceService {
  getPrice = async (address: string): Promise<number> => {
    if (address === process.env.DEFINIX_TOKEN) {
      return this.getFinixPrice();
    }

    try {
      let data: CoinGeckoResponse = {};
      let id = "";
      if (address in tokens) {
        id = tokens[address].id;
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`
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
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
          ","
        )}&vs_currencies=usd`
      );
      return data as CoinGeckoResponse;
    } catch (e) {
      console.log("Error getting price", e);
    }

    return ids.reduce((cur, id) => (cur[id] = { usd: 0 }), {});
  };

  getFinixPrice = async (): Promise<number> => {
    try {
      const { data } = await axios.get(
        `${process.env.DEFINIX_HOST}${process.env.DEFINIX_PRICE_ENDPOINT}`
      );

      return data.price || 0;
    } catch (e) {
      console.log("Error getting finix price", e);
    }
    return 0;
  };
}
