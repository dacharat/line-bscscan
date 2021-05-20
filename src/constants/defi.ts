import { ICompoundFlip, IDefi } from "../types";

import cakeMc from "../abi/pancake/MasterChef.json";
import definixMc from "../abi/definix/MasterChef.json";
import pantherMc from "../abi/panther/MasterChef.json";
import wardenMc from "../abi/warden/MasterChef.json";
import garudaMc from "../abi/garuda/MasterChef.json";
import gatorMc from "../abi/gator/MasterChef.json";
import doppleMc from "../abi/dopple/MasterChef.json";
import ploutozMc from "../abi/ploutoz/MasterChef.json";

import { pools as pancakePools } from "./pancake/pools";
import { pools as finixPools } from "./finix/pools";
import { pools as pantherPools } from "./panther/pools";
import { pools as wardenPools } from "./warden/pools";
import { pools as garudaPools } from "./garuda/pools";
import { pools as gatorPools } from "./gator/pools";
import { pools as dopplePools } from "./dopple/pools";
import { pools as ploutozPools } from "./ploutoz/pools";

import autosharkCF from "../abi/autoshark/StrategyCompoundFLIP.json";
import { pools as autosharkPools } from "./autoshark/pools";

export const defi: IDefi = {
  cake: {
    address: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
    abi: cakeMc.abi,
    pools: pancakePools,
    type: "yield",
  },
  finix: {
    address: "0x6b51E8FDc32Ead0B837deb334fcB79E24F3b105A",
    abi: definixMc.abi,
    pools: finixPools,
    type: "yield",
  },
  panther: {
    address: "0x058451C62B96c594aD984370eDA8B6FD7197bbd4",
    abi: pantherMc.abi,
    pools: pantherPools,
    type: "yield",
  },
  warden: {
    address: "0xde866dd77b6df6772e320dc92bff0eddc626c674",
    abi: wardenMc.abi,
    pools: wardenPools,
    type: "yield",
  },
  garuda: {
    address: "0xf6afb97ac5eafad60d3ad19c2f85e0bd6b7eaccf",
    abi: garudaMc.abi,
    pools: garudaPools,
    type: "yield",
  },
  // Gator: {
  //   address: "0x55Da3b152F48378A42D091be1eef2af37964BE45",
  //   abi: gatorMc.abi,
  //   pools: gatorPools,
  //   type: "yield",
  // },
  // grizzly: {
  //   address: "0x6ad77aeb7fc86751f375ea1711dc2cb25c9d4d16",
  //   abi: grizzlyMc.abi,
  //   pools: grizzlyPools,
  // },
  dopple: {
    address: "0xda0a175960007b0919dbf11a38e6ec52896bddbe",
    abi: doppleMc.abi,
    pools: dopplePools,
    type: "yield",
  },
  ploutoz: {
    address: "0x9cd0daac9d1caa9e937fc5bb4e1c0e058d9b6f94",
    abi: ploutozMc.abi,
    pools: ploutozPools,
    type: "yield",
  },
  autoShark: {
    address: "0x625E4fad723A658c71B8751ea3a342565096BC06",
    abi: autosharkCF.abi,
    pools: autosharkPools,
    type: "automate",
  },
};

export const compoundFlip: ICompoundFlip = {
  autoShark: {
    abi: autosharkCF.abi,
    address: "0x625E4fad723A658c71B8751ea3a342565096BC06",
    poolName: "panther",
    performanceFee: 30,
  },
};
