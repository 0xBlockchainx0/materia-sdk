import { ChainId, Token, Pair, TokenAmount, IETH, Price } from '../src'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

describe('Pair', () => {
  const GIL: { [chainId in ChainId]: Token } = {
    [ChainId.MAINNET]: new Token(ChainId.MAINNET, ZERO_ADDRESS, 18, 'GIL', 'GIL'),
    [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0xa5a5f4ECD079e8C92d4D8Ec3AC7bFcD37B5e4ab2', 18, 'LIG', 'LIG'),
    [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'GIL', 'GIL'),
    [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'GIL', 'GIL'),
    [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'GIL', 'GIL')
  }
  
  const USD: { [chainId in ChainId]: Token } = {
    [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x44086035439E676c02D411880FcCb9837CE37c57', 18, 'uSD', 'unified Stable Dollar'),
    [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, '0x3CF9679b78075054093E04bB27758A0b25c2BdBc', 18, 'PIT', 'Pitfall'),
    [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, ZERO_ADDRESS, 18, 'uSD', 'unified Stable Dollar'),
    [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, ZERO_ADDRESS, 18, 'uSD', 'unified Stable Dollar'),
    [ChainId.KOVAN]: new Token(ChainId.KOVAN, ZERO_ADDRESS, 18, 'uSD', 'unified Stable Dollar'),
  }
  const DAI = new Token(ChainId.ROPSTEN, '0xc2118d4d90b274016cb7a54c03ef52e6c537d957', 18, 'DAI', 'DAI Stablecoin')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(IETH[ChainId.RINKEBY], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(USD[ChainId.ROPSTEN], DAI)).toEqual('0xe734464e614643eE74952ED5cD5D79cF6382280A')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '100')).token0).toEqual(USD[ChainId.ROPSTEN])
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USD[ChainId.ROPSTEN], '100')).token0).toEqual(USD[ChainId.ROPSTEN])
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '100')).token1).toEqual(DAI)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USD[ChainId.ROPSTEN], '100')).token1).toEqual(DAI)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '101')).reserve0).toEqual(
        new TokenAmount(USD[ChainId.ROPSTEN], '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USD[ChainId.ROPSTEN], '100')).reserve0).toEqual(
        new TokenAmount(USD[ChainId.ROPSTEN], '100')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '101')).reserve1).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USD[ChainId.ROPSTEN], '100')).reserve1).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '101'), new TokenAmount(DAI, '100')).token0Price).toEqual(
        new Price(USD[ChainId.ROPSTEN], DAI, '101', '100')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USD[ChainId.ROPSTEN], '101')).token0Price).toEqual(
        new Price(USD[ChainId.ROPSTEN], DAI, '101', '100')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '101'), new TokenAmount(DAI, '100')).token1Price).toEqual(
        new Price(DAI, USD[ChainId.ROPSTEN], '100', '101')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USD[ChainId.ROPSTEN], '101')).token1Price).toEqual(
        new Price(DAI, USD[ChainId.ROPSTEN], '100', '101')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '101'), new TokenAmount(DAI, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token1Price)
      expect(pair.priceOf(USD[ChainId.ROPSTEN])).toEqual(pair.token0Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(IETH[ChainId.ROPSTEN])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '101')).reserveOf(USD[ChainId.ROPSTEN])).toEqual(
        new TokenAmount(USD[ChainId.ROPSTEN], '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USD[ChainId.ROPSTEN], '100')).reserveOf(USD[ChainId.ROPSTEN])).toEqual(
        new TokenAmount(USD[ChainId.ROPSTEN], '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USD[ChainId.ROPSTEN], '100')).reserveOf(IETH[ChainId.ROPSTEN])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '100')).chainId).toEqual(ChainId.ROPSTEN)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USD[ChainId.ROPSTEN], '100')).chainId).toEqual(ChainId.ROPSTEN)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '100')).involvesToken(USD[ChainId.ROPSTEN])).toEqual(true)
    expect(new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '100')).involvesToken(DAI)).toEqual(true)
    expect(
      new Pair(new TokenAmount(USD[ChainId.ROPSTEN], '100'), new TokenAmount(DAI, '100')).involvesToken(IETH[ChainId.ROPSTEN])
    ).toEqual(false)
  })
})
