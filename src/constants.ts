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

export const PROXY_ADDRESS = '0xb19f100c3c02ac469874c8c3a1038c7007950d81'
export const FACTORY_ADDRESS = '0x902e7cdDB4821c30B4A8FD7F8FDF62c439AA0657'
export const INIT_CODE_HASH = '0xf79c9250dcc326869d68244ec72bf9db8eef77e832de86e4ddb5d4aa37376d68'
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
export const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS = 4
export const SWAP_ACTION_TOKENS_FOR_EXACT_ETH = 5
export const SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS = 6