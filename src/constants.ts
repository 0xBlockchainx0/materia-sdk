import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const PROXY_ADDRESS = '0x23B3eaEEE744C9E1920FF905685b8E27738B9328'
export const FACTORY_ADDRESS = '0xbdd7c37334c565c97ee992c459b4f6d89fad6b2d'
export const INIT_CODE_HASH = '0xc24719c58ea1a5f96299c52b3006cc2e537e3a5dce54173a9c92d41b74beb651'
export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

export const SWAP_ACTION_EXACT_TOKENS_FOR_ETH_SUPPORTING_FEE_ON_TRANSFER_TOKENS = 1
export const SWAP_ACTION_EXACT_TOKENS_FOR_ETH = 2
export const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS_SUPPORTING_FEE_ON_TRANSFER_TOKENS = 3
export const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS = 3
export const SWAP_ACTION_TOKENS_FOR_EXACT_ETH = 4
export const SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS = 5
export const SWAP_ACTION_EXACT_TOKENS_FOR_ETH_SUPPORTING_FEE_ON_TRANSFER_TOKENS_UNWRAP = 101
export const SWAP_ACTION_EXACT_TOKENS_FOR_ETH_UNWRAP = 102
export const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS_SUPPORTING_FEE_ON_TRANSFER_TOKENS_UNWRAP = 103
export const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS_UNWRAP = 103
export const SWAP_ACTION_TOKENS_FOR_EXACT_ETH_UNWRAP = 104
export const SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS_UNWRAP = 105