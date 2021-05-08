import { IDefi } from "../types";

import cakeMc from "../abi/pancake/MasterChef.json";
import definixMc from "../abi/definix/MasterChef.json";
import pantherMc from "../abi/panther/MasterChef.json";
import wardenMc from "../abi/warden/MasterChef.json";
import garudaMc from "../abi/garuda/MasterChef.json";
import gatorMc from "../abi/gator/MasterChef.json";

import { pools as pancakePools } from "./pancake/pools";
import { pools as finixPools } from "./finix/pools";
import { pools as pantherPools } from "./panther/pools";
import { pools as wardenPools } from "./warden/pools";
import { pools as garudaPools } from "./garuda/pools";
import { pools as gatorPools } from "./gator/pools";

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
  warden: {
    address: "0xde866dd77b6df6772e320dc92bff0eddc626c674",
    abi: wardenMc.abi,
    pools: wardenPools,
  },
  garuda: {
    address: "0xf6afb97ac5eafad60d3ad19c2f85e0bd6b7eaccf",
    abi: garudaMc.abi,
    pools: garudaPools,
  },
  Gator: {
    address: "0x55Da3b152F48378A42D091be1eef2af37964BE45",
    abi: gatorMc.abi,
    pools: gatorPools,
  },
};
