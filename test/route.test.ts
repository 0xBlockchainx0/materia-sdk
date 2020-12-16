import { Token, IETH, ChainId, Pair, TokenAmount, Route, ETHER } from '../src'

describe('Route', () => {
  const token0 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')
  const ieth = IETH[ChainId.MAINNET]
  const pair_0_1 = new Pair(new TokenAmount(token0, '100'), new TokenAmount(token1, '200'))
  const pair_0_ieth = new Pair(new TokenAmount(token0, '100'), new TokenAmount(ieth, '100'))
  const pair_1_ieth = new Pair(new TokenAmount(token1, '175'), new TokenAmount(ieth, '100'))

  it('constructs a path from the tokens', () => {
    const route = new Route([pair_0_1], token0)
    expect(route.pairs).toEqual([pair_0_1])
    expect(route.path).toEqual([token0, token1])
    expect(route.input).toEqual(token0)
    expect(route.output).toEqual(token1)
    expect(route.chainId).toEqual(ChainId.MAINNET)
  })

  it('can have a token as both input and output', () => {
    const route = new Route([pair_0_ieth, pair_0_1, pair_1_ieth], ieth)
    expect(route.pairs).toEqual([pair_0_ieth, pair_0_1, pair_1_ieth])
    expect(route.input).toEqual(ieth)
    expect(route.output).toEqual(ieth)
  })

  it('supports ether input', () => {
    const route = new Route([pair_0_ieth], ETHER)
    expect(route.pairs).toEqual([pair_0_ieth])
    expect(route.input).toEqual(ETHER)
    expect(route.output).toEqual(token0)
  })

  it('supports ether output', () => {
    const route = new Route([pair_0_ieth], token0, ETHER)
    expect(route.pairs).toEqual([pair_0_ieth])
    expect(route.input).toEqual(token0)
    expect(route.output).toEqual(ETHER)
  })
})
