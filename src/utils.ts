import BigNumber from "bignumber.js";
import { merge } from "lodash";

const REJECT_DELAY_DEFAULT = parseInt(process.env.REJECT_DELAY_DEFAULT) || 7000;

export const toDecimal = (wei: any, decimals: number) =>
  new BigNumber(wei).dividedBy(new BigNumber(`1e${decimals}`));

export const formatNumber = (
  input: number,
  options?: Intl.NumberFormatOptions
) => {
  return input?.toLocaleString(
    undefined,
    merge(
      {},
      {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      },
      options
    )
  );
};

export const isValidAddress = (address: string) =>
  /^0x[a-fA-F0-9]{40}$/g.test(address);

export const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const rejectAfterDelay = (
  reason?: any,
  ms: number = REJECT_DELAY_DEFAULT
) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(reason), ms, new Error("timeout"));
  });
