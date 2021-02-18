import {
  ORCHESTRATOR_ADDRESS,
  SWAP_ACTION_EXACT_TOKENS_FOR_ETH,
  SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS,
  SWAP_ACTION_TOKENS_FOR_EXACT_ETH,
  SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS,
  TradeType
} from './constants'
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from './utils'
import { Currency, CurrencyAmount, ETHER, Percent, Token, TokenAmount, Trade } from './entities'
import Web3 from 'web3'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { JSBI } from '.'

/**
 * Options for producing the arguments to send call to the router.
 */
export interface TradeOptions {
  /**
   * How much the execution price is allowed to move unfavorably from the trade execution price.
   */
  allowedSlippage: Percent
  /**
   * How long the swap is valid until it expires, in seconds.
   * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
   * are generated.
   */
  ttl: number
  /**
   * The account that should receive the output of the swap.
   */
  recipient: string

  /**
   * Whether any of the tokens in the path are fee on transfer tokens, which should be handled with special methods
   */
  feeOnTransfer?: boolean
}

export interface TradeOptionsDeadline extends Omit<TradeOptions, 'ttl'> {
  /**
   * When the transaction expires.
   * This is an atlernate to specifying the ttl, for when you do not want to use local time.
   */
  deadline: number
}

/**
 * The parameters to use in the call to the Materia Router to execute a trade.
 */
export interface SwapParameters {
  /**
   * The method to call on the Materia Router.
   */
  methodName: string
  /**
   * The arguments to pass to the method, all hex encoded.
   */
  args: (string | string[])[]
  /**
   * The amount of wei to send in hex.
   */
  value: string
}

function toHex(currencyAmount: CurrencyAmount) {
  return `0x${currencyAmount.raw.toString(16)}`
}

const ZERO_HEX = '0x0'

/**
 * Represents the Materia Router, and has static methods for helping execute trades.
 */
export abstract class Router {
  /**
   * Cannot be constructed.
   */
  private constructor() { }
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   * @param tokenIn input token address
   * @param tokenOut output token address
   * @param etherIn input currency is ETH
  *  @param etherOut output currency is ETH
   * @param isEthItem flag for check if is EthItem
   * @param objectId objectId for the EthItem
   */
  public static swapCallParameters(
    trade: Trade,
    options: TradeOptions | TradeOptionsDeadline, 
    tokenIn: Token,
    tokenOut: Token,
    etherIn: Boolean,
    etherOut: Boolean,
    isEthItem: boolean, 
    objectId: string | null,
  ): SwapParameters {
    const web3 = new Web3();
    
    // the router does not support both ether in and out
    invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
    invariant(!('ttl' in options) || options.ttl > 0, 'TTL')

    const to: string = validateAndParseAddress(options.recipient)

    const maximumAmountIn = trade.maximumAmountIn(options.allowedSlippage)
    const minimumAmountOut = trade.minimumAmountOut(options.allowedSlippage)
    
    const currencyAmountIn = Router.decodeInteroperableValueToERC20TokenAmount(maximumAmountIn, tokenIn, etherIn)
    const currencyAmountOut = Router.decodeInteroperableValueToERC20TokenAmount(minimumAmountOut, tokenOut, etherOut)

    const amountIn: string = toHex(currencyAmountIn ?? maximumAmountIn)
    const amountOut: string = toHex(currencyAmountOut ?? minimumAmountOut)
    
    let path: string[] = trade.route.path.map(token => token.address)

    const inputToken = path[0] == tokenIn?.address || etherIn ? path[0] : tokenIn?.address
    const outputToken = path[path.length - 1] == tokenOut?.address || etherOut ? path[path.length - 1] : tokenOut?.address

    path[0] = inputToken
    path[path.length - 1] = outputToken

    const deadline =
      'ttl' in options
        ? `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`
        : `0x${options.deadline.toString(16)}`

    let methodName: string
    let args: (any | any[])[]
    let value: string

    if (isEthItem) {
      // (address from, address to, uint256 id, uint256 amount, bytes calldata data)
      methodName = 'safeTransferFrom'

      let operation: number
      let ethItemArgs: (any | any[])

      switch (trade.tradeType) {
        case TradeType.EXACT_INPUT:
          if (etherOut) {
            operation = SWAP_ACTION_EXACT_TOKENS_FOR_ETH 
          } else {
            operation = SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS
          }

          // (uint amountOutMin, address[] memory path, address to, uint deadline)
          ethItemArgs = web3.eth.abi.encodeParameters(
            ["uint256", "bytes"],
            [operation, web3.eth.abi.encodeParameters(
              ["uint", "address[]", "address", "uint"],
              [amountOut, path, to, deadline]
            )]
          )
          args = [to, ORCHESTRATOR_ADDRESS, objectId ?? "0", amountIn, ethItemArgs]
          value = ZERO_HEX

          break
        case TradeType.EXACT_OUTPUT:
          if (etherOut) {
            operation = SWAP_ACTION_TOKENS_FOR_EXACT_ETH
          } else {
            operation = SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS
          }

          // (uint amountOut, address[] memory path, address to, uint deadline)
          ethItemArgs = web3.eth.abi.encodeParameters(
            ["uint256", "bytes"],
            [operation, web3.eth.abi.encodeParameters(
              ["uint", "address[]", "address", "uint"],
              [amountOut, path, to, deadline]
            )]
          )
          args = [to, ORCHESTRATOR_ADDRESS, objectId ?? "0", amountIn, ethItemArgs]
          value = ZERO_HEX

          break
      }
    }
    else {
      switch (trade.tradeType) {
        case TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = 'swapExactETHForTokens'
            // (uint amountOutMin, address[] memory path, address to, uint deadline)
            args = [amountOut, path, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = 'swapExactTokensForETH'
            // (uint amountIn, uint amountOutMin, address[] memory path, address to, uint deadline)
            args = [amountIn, amountOut, path, to, deadline]
            value = ZERO_HEX
          } else {
            methodName = 'swapExactTokensForTokens'
            // (uint amountIn, uint amountOutMin, address[] memory path, address to, uint deadline)
            args = [amountIn, amountOut, path, to, deadline]
            value = ZERO_HEX
          }
          break
        case TradeType.EXACT_OUTPUT:
          if (etherIn) {
            methodName = 'swapETHForExactTokens'
            // (uint amountOut, address[] memory path, address to, uint deadline)
            args = [amountOut, path, to, deadline]
            value = amountIn
          } else if (etherOut) {
            methodName = 'swapTokensForExactETH'
            // (uint amountOut, uint amountInMax, address[] memory path, address to, uint deadline)
            args = [amountOut, amountIn, path, to, deadline]
            value = ZERO_HEX
          } else {
            methodName = 'swapTokensForExactTokens'
            // (uint amountOut, uint amountInMax, address[] memory path, address to, uint deadline)
            args = [amountOut, amountIn, path, to, deadline]
            value = ZERO_HEX
          }
          break
      }
    }

    return {
      methodName,
      args,
      value
    }
  }

  private static decodeInteroperableValueToERC20TokenAmount(currencyAmount: CurrencyAmount, erc20Currency: Currency, isETH: Boolean): CurrencyAmount | undefined {
    if (!currencyAmount || !erc20Currency || isETH) {
      return undefined
    }
    const value = currencyAmount.toExact()
    const currency = currencyAmount.currency
  
    if (!value || !currency || !erc20Currency) {
      return undefined
    }
    try {
      const formattedDecimals = currency.decimals - erc20Currency.decimals
      const typedValueParsed = parseUnits(value, currency.decimals).toString()
      
      let typedValueFormatted: Number = Number(0)
  
      if (formattedDecimals > 0) {
        typedValueFormatted = Number(formatUnits(typedValueParsed, formattedDecimals))
      }
      else if (formattedDecimals == 0) {
        typedValueFormatted = Number(typedValueParsed)
      }
      else {
        // EthItem can't unwrap token with more than 18 decimals 
        throw 'Too much decimals for EthItem'
      }
      
      return erc20Currency instanceof Token
        ? new TokenAmount(erc20Currency, JSBI.BigInt(typedValueFormatted))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueFormatted))
    } catch (error) {
      // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
      // console.log(`Failed to parse input amount: "${value}"`, error)
      return undefined
    }
  }
}