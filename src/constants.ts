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

export const DEFAULT_CHAIN_ID = ChainId.ROPSTEN
export const INFURA_PROJECT_KEY = 'b038585ef8b84eb7a116e796d9403896'
export const INFURA_ADDRESS = `https://${ChainName[DEFAULT_CHAIN_ID]}.infura.io/v3/${INFURA_PROJECT_KEY}`
export const ORCHESTRATOR_ADDRESS = '0xcC4de6469bc6F2417c87CbECB2179b7c5F090fe9'
export const FACTORY_ADDRESS = '0xe34Fde926ab6ff4bc1B9d069FDB10DA922Af6881'
export const ERC20_WRAPPER_V1_ADDRESS = '0x651A6837457f1f7179a590deC647Ec5D647B8231'
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