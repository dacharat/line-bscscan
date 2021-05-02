import axios from "axios";
import { tokens } from "../constants/coingecko";

export class PriceService {
  getPrice = async (address: string) => {
    if (address === process.env.DEFINIX_TOKEN) {
      return this.getFinixPrice();
    }

    try {
      let data = {};
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
  getPrices = async (ids: string[]) => {
    try {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(
          ","
        )}&vs_currencies=usd`
      );
      return data;
    } catch (e) {
      console.log("Error getting price", e);
    }
    return 0;
  };

  getFinixPrice = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.DEFINIX_HOST}${process.env.DEFINIX_PRICE_ENDPOINT}`
      );

      return data.price;
    } catch (e) {
      console.log("Error getting finix price", e);
    }
    return 0;
  };
}
