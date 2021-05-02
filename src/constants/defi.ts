import { IDefi } from "../types";

import cakeMc from "../abi/pancake/MasterChef.json";
import definixMc from "../abi/definix/MasterChef.json";
import pantherMc from "../abi/panther/MasterChef.json";

import { pools as pancakePools } from "./pancake/pools";
import { pools as finixPools } from "./finix/pools";
import { pools as pantherPools } from "./panther/pools";

export const defi: IDefi = {
  cake: {
    address: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
    abi: cakeMc.abi,
    pools: pancakePools,
  },
  finix: {
    address: "0x6b51E8FDc32Ead0B837deb334fcB79E24F3b105A",
    abi: definixMc.abi,
    pools: finixPools,
  },
  panther: {
    address: "0x058451C62B96c594aD984370eDA8B6FD7197bbd4",
    abi: pantherMc.abi,
    pools: pantherPools,
  },
};
