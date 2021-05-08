# line-bscscan

![](https://raw.githubusercontent.com/dacharat/line-bscscan/main/assets/BSC%20Scanner.gif?token=AGARWYCF3BFTVLTVB4W22YDATJWMU)

### Get started

- add line `@350bekvu`
- input your wallet address and hit send
- see your asset!!

#### Wallet token available
- BNB
- BUSD
- SIX
- CAKE
- SAFEMOON
- PANTHER
- FINIX
- WARDEN

#### Pool available
- [PancakeSwap](https://pancakeswap.finance/)
- [Defnix](https://bsc.definix.com/)
- [PantherSwap](https://pantherswap.com/)
- [WardenSwap](https://www.wardenswap.finance/#/)
- [GarudaSwap](https://garudaswap.finance/)
- [GatorSwap](https://gatorswap.xyz/)

#### How to add new pool
- add pool MasterChef abi to `src/abi/{pool}/MasterChef.json`
- add token pool detail to `src/constants/coingecko.ts`
- add pool detail to `src/constants/defi.ts` (pool name, id, master chef abi)
- change `getPoolInfos` at `src/script/index.ts` parameter to new pool name
- run `yarn script`
- copy result from `token-{pool}.txt` to `src/constants/{pool}/pools.ts`
- add pool list to `src/constants/defi.ts` again
- in case that coingecko doesn't list token pool to platform
  - you need to add `{pool token}-BUSD` pool address to `lpPair` at `src/constants/coingecko.ts`
  - also add token address to `src/constants/whitelist.ts` 

#### Features
- [x] list assets from BSC wallet
- [x] list assets from BSC DEFI
- [x] get reward token price(ex. WAD)
- [ ] improve flex UI

inspire by [LINE x PancakeSwap](https://medium.com/linedevth/line-x-pancakeswap-%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%99%E0%B9%8C%E0%B9%84%E0%B8%9B-%E0%B8%81%E0%B9%87%E0%B8%94%E0%B8%B9%E0%B8%9F%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%A1%E0%B9%84%E0%B8%94%E0%B9%89-%E0%B8%8B%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%8B%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B9%84%E0%B8%9B%E0%B8%94%E0%B8%B9%E0%B8%81%E0%B8%B1%E0%B8%99-eed4951679f3) + [Apeboard](https://apeboard.finance/dashboard)
