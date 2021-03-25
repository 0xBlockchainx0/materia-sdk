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

export const ChainName = {
  [ChainId.MAINNET]: 'mainnet',
  [ChainId.ROPSTEN]: 'ropsten',
  [ChainId.RINKEBY]: 'rinkeby',
  [ChainId.GÖRLI]: 'goerli',
  [ChainId.KOVAN]: 'kovan'
}

// export const FACTORY_ADDRESS = '0xB498a69fF7b9a73C58491d564Fc6a462b259c860'
// export const ORCHESTRATOR_ADDRESS = '0xB0F720Baa5BD1715897d4790A59f5c7aa1377D79'
export const FACTORY_ADDRESS = '0x0842c3E3ff99AEb1984A356dCd4b8c1812C82189'
export const ORCHESTRATOR_ADDRESS = '0x42e9287558dDD75890e0f26dDb844a2b2FfE88F8'

export const INIT_CODE_HASH = '0x1974917c1e01e6369c1b45f631eae6a71d24cb5108c460cc7f0b1c608b3a7c94'
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

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

export const ADD_LIQUIDITY_ACTION_SAFE_TRANSFER_TOKEN = 1
export const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS = 2
export const SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS = 3
export const SWAP_ACTION_EXACT_TOKENS_FOR_ETH = 4
export const SWAP_ACTION_TOKENS_FOR_EXACT_ETH = 5