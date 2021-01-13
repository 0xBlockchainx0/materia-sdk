import invariant from 'tiny-invariant'
import { ChainId, CurrencyAmount, ETHER, Pair, Percent, Route, Router, Token, TokenAmount, Trade, IETH } from '../src'
import JSBI from 'jsbi'

function checkDeadline(deadline: string[] | string): void {
  expect(typeof deadline).toBe('string')
  invariant(typeof deadline === 'string')
  // less than 5 seconds on the deadline
  expect(new Date().getTime() / 1000 - parseInt(deadline)).toBeLessThanOrEqual(5)
}

describe('Router', () => {
  const USD = new Token(ChainId.ROPSTEN, '0x3CF9679b78075054093E04bB27758A0b25c2BdBc', 18, 'PIT', 'Pitfall')
  const GIL = new Token(ChainId.ROPSTEN, '0xa5a5f4ECD079e8C92d4D8Ec3AC7bFcD37B5e4ab2', 18, 'LIG', 'LIG')
  const DAI = new Token(ChainId.ROPSTEN, '0xc2118d4d90b274016cb7a54c03ef52e6c537d957', 18, 'DAI', 'DAI Stablecoin')

  const pair_usd_gil = new Pair(new TokenAmount(USD, JSBI.BigInt(1000)), new TokenAmount(GIL, JSBI.BigInt(1000)))
  const pair_usd_dai = new Pair(new TokenAmount(USD, JSBI.BigInt(1000)), new TokenAmount(DAI, JSBI.BigInt(1000)))
  const pair_usd_eth = new Pair(new TokenAmount(USD, JSBI.BigInt(1000)), new TokenAmount(IETH[ChainId.ROPSTEN], JSBI.BigInt(1000)))

  describe('#swapCallParameters', () => {
    describe('exact in', () => {
      it('ether to DAI', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_usd_eth, pair_usd_dai], ETHER, DAI), CurrencyAmount.ether(JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') },
          false,
          null
        )
        expect(result.methodName).toEqual('swapExactETHForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x51',
          [IETH[ChainId.ROPSTEN].address, USD.address, DAI.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x64')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('deadline specified', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_usd_eth, pair_usd_dai], ETHER, DAI), CurrencyAmount.ether(JSBI.BigInt(100))),
          {
            deadline: 50,
            recipient: '0x0000000000000000000000000000000000000004',
            allowedSlippage: new Percent('1', '100')
          },
          false,
          null
        )
        expect(result.methodName).toEqual('swapExactETHForTokens')
        expect(result.args).toEqual([
          '0x51',
          [IETH[ChainId.ROPSTEN].address, USD.address, DAI.address],
          '0x0000000000000000000000000000000000000004',
          '0x32'
        ])
        expect(result.value).toEqual('0x64')
      })
      it('DAI to ether', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_usd_dai, pair_usd_eth], DAI, ETHER), new TokenAmount(DAI, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') },
          false,
          null
        )
        expect(result.methodName).toEqual('swapExactTokensForETH')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x51',
          [DAI.address, USD.address, IETH[ChainId.ROPSTEN].address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('USD to DAI', () => {
        const result = Router.swapCallParameters(
          Trade.exactIn(new Route([pair_usd_dai], USD, DAI), new TokenAmount(USD, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') },
          false,
          null
        )
        expect(result.methodName).toEqual('swapExactTokensForTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x59',
          [USD.address, DAI.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })  
    })
    describe('exact out', () => {
      it('ether to DAI', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair_usd_eth, pair_usd_dai], ETHER, DAI), new TokenAmount(DAI, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') },
          false,
          null
        )
        expect(result.methodName).toEqual('swapETHForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          [IETH[ChainId.ROPSTEN].address, USD.address, DAI.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x80')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('DAI to ether', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair_usd_dai, pair_usd_eth], DAI, ETHER), CurrencyAmount.ether(JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100'), feeOnTransfer: true },
          false,
          null
        )
        expect(result.methodName).toEqual('swapTokensForExactETH')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x80',
          [DAI.address, USD.address, IETH[ChainId.ROPSTEN].address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
      it('USD to DAI', () => {
        const result = Router.swapCallParameters(
          Trade.exactOut(new Route([pair_usd_dai], USD, DAI), new TokenAmount(DAI, JSBI.BigInt(100))),
          { ttl: 50, recipient: '0x0000000000000000000000000000000000000004', allowedSlippage: new Percent('1', '100') },
          false,
          null
        )
        expect(result.methodName).toEqual('swapTokensForExactTokens')
        expect(result.args.slice(0, -1)).toEqual([
          '0x64',
          '0x71',
          [USD.address, DAI.address],
          '0x0000000000000000000000000000000000000004'
        ])
        expect(result.value).toEqual('0x0')
        checkDeadline(result.args[result.args.length - 1])
      })
    })
  })
})
