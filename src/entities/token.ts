import invariant from 'tiny-invariant'
import { ChainId, ZERO_ADDRESS } from '../constants'
import { validateAndParseAddress } from '../utils'
import { Currency } from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const IETH = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x1D6316dbbE18b6E9B75AE064aA114FE7dC208eDC', 18, 'IETH', 'EthereumItem'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0xEDf7dE64832b6D0998fE7E7D556A38005B994565', 18, 'IETH', 'EthereumItem'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'IETH', 'EthereumItem'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'IETH', 'EthereumItem'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'IETH', 'EthereumItem')
}
