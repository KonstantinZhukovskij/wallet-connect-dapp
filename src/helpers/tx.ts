import * as encoding from "@walletconnect/encoding";

import {
  apiGetAccountBalance,
  apiGetAccountNonce,
  apiGetGasPrice,
} from "./api";

export async function formatTestTransaction(account: string) {
  const [namespace, reference, address] = account.split(":");
  const chainId = `${namespace}:${reference}`;

  let _nonce;
  try {
    _nonce = await apiGetAccountNonce(address, chainId);
  } catch (error) {
    throw new Error(
      `Failed to fetch nonce for address ${address} on chain ${chainId}`
    );
  }

  let _assetData;
  try {
    _assetData = await apiGetAccountBalance(address, chainId);
  } catch (error) {
    throw new Error(
      `Failed to fetch account balance for address ${address} on chain ${chainId}`
    );
  }

  const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));

  // gasPrice
  const _gasPrice = await apiGetGasPrice(chainId);
  const gasPrice = encoding.sanitizeHex(_gasPrice);

  // gasLimit
  const _gasLimit = 21000;
  const gasLimit = encoding.sanitizeHex(_gasLimit.toString(16));

  // value
  const _value = _assetData?.balance ? parseInt(_assetData.balance) / 10 : 0;
  const value = encoding.sanitizeHex(_value.toString(16));
  // const value = encoding.sanitizeHex(encoding.numberToHex(_value));

  const tx = {
    from: address,
    to: address,
    data: "0x",
    nonce,
    gasPrice,
    gasLimit,
    value,
  };

  return tx;
}
