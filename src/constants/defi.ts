import { DefiType, IDefi } from "../types";

import cakeMc from "../abi/pancake/MasterChef.json";
import definixMc from "../abi/definix/MasterChef.json";
import pantherMc from "../abi/panther/MasterChef.json";
import wardenMc from "../abi/warden/MasterChef.json";
import garudaMc from "../abi/garuda/MasterChef.json";
import doppleMc from "../abi/dopple/MasterChef.json";
import ploutozMc from "../abi/ploutoz/MasterChef.json";
import aleMc from "../abi/ale/MasterChef.json";

import { pools as pancakePools } from "./pancake/pools";
import { pools as finixPools } from "./finix/pools";
import { pools as pantherPools } from "./panther/pools";
import { pools as wardenPools } from "./warden/pools";
import { pools as garudaPools } from "./garuda/pools";
import { pools as dopplePools } from "./dopple/pools";
import { pools as ploutozPools } from "./ploutoz/pools";
import { pools as alePools } from "./ale/pools";

// import autosharkCF from "../abi/autoshark/StrategyCompoundFLIP.json";
// import { pools as autosharkPools } from "./autoshark/pools";

import pantherJungle from "../abi/panther/Jungle.json";
import { pools as pantherJunglePools } from "./panther/jungle";

import pancakebunnyCF from "../abi/pancakebunny/VaultFlipToFlip.json";
import { pools as pancakebunnyPools } from "./pancakebunny/pools";

export const defi: IDefi = {
  cake: {
    address: "0x73feaa1eE314F8c655E354234017bE2193C9E24E",
    abi: cakeMc.abi,
    pools: pancakePools,
    type: DefiType.YEILD,
  },
  finix: {
    address: "0x6b51E8FDc32Ead0B837deb334fcB79E24F3b105A",
    abi: definixMc.abi,
    pools: finixPools,
    type: DefiType.YEILD,
  },
  panther: {
    address: "0x058451C62B96c594aD984370eDA8B6FD7197bbd4",
    abi: pantherMc.abi,
    pools: pantherPools,
    type: DefiType.YEILD,
  },
  pantherJungle: {
    address: "0x3b5ed7b0f8bf5d2b485352e15a416092ca741c2c",
    abi: pantherJungle.abi,
    pools: pantherJunglePools,
    type: DefiType.JUNGLE,
  },
  warden: {
    address: "0xde866dd77b6df6772e320dc92bff0eddc626c674",
    abi: wardenMc.abi,
    pools: wardenPools,
    type: DefiType.YEILD,
  },
  garuda: {
    address: "0xf6afb97ac5eafad60d3ad19c2f85e0bd6b7eaccf",
    abi: garudaMc.abi,
    pools: garudaPools,
    type: DefiType.YEILD,
  },
  dopple: {
    address: "0xda0a175960007b0919dbf11a38e6ec52896bddbe",
    abi: doppleMc.abi,
    pools: dopplePools,
    type: DefiType.YEILD,
  },
  ploutoz: {
    address: "0x9cd0daac9d1caa9e937fc5bb4e1c0e058d9b6f94",
    abi: ploutozMc.abi,
    pools: ploutozPools,
    type: DefiType.YEILD,
  },
  ale: {
    address: "0x0646edade9c7e8ae361e51721118333b2978f333",
    abi: aleMc.abi,
    pools: alePools,
    type: DefiType.YEILD,
  },
  // autoshark: {
  //   // pause for flash loan issue
  //   address: "0xc1bf412E918e7ed4Df2f3438Fafd3fCadF9F3C15",
  //   abi: autosharkCF.abi,
  //   pools: autosharkPools,
  //   type: DefiType.AUTOCOMPOUND,
  //   performance: {
  //     feePercentage: 30,
  //     tokenAddress: "0xf7321385a461c4490d5526d83e63c366b149cb15",
  //   },
  // },
  pancakebunny: {
    address: "0x203Ee29ba85BbDfA23bFaE5D77620AeFDaf92cB1",
    abi: pancakebunnyCF.abi,
    pools: pancakebunnyPools,
    type: DefiType.AUTOCOMPOUND,
    performance: {
      feePercentage: 30,
      tokenAddress: "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51",
    },
  },
};
