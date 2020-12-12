import {
  PROXY_ADDRESS,
  SWAP_ACTION_EXACT_TOKENS_FOR_ETH,
  SWAP_ACTION_EXACT_TOKENS_FOR_ETH_SUPPORTING_FEE_ON_TRANSFER_TOKENS,
  SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS,
  SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS_SUPPORTING_FEE_ON_TRANSFER_TOKENS,
  SWAP_ACTION_TOKENS_FOR_EXACT_ETH,
  SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS,
  TradeType
} from './constants'
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from './utils'
import { CurrencyAmount, ETHER, Percent, Trade } from './entities'
import Web3 from 'web3'

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
   * @param isEthItem flag for check if is EthItem
   * @param needUnwrap flag for check if after the swap the EthItem needs to be unwrapped
   * @param objectId objectId for the EthItem
   */
  public static swapCallParameters(trade: Trade, options: TradeOptions | TradeOptionsDeadline, isEthItem: boolean, needUnwrap: boolean, objectId: string | null): SwapParameters {
    const web3 = new Web3();
    const etherIn = trade.inputAmount.currency === ETHER
    const etherOut = trade.outputAmount.currency === ETHER
    
    // the router does not support both ether in and out
    invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
    invariant(!('ttl' in options) || options.ttl > 0, 'TTL')

    const to: string = validateAndParseAddress(options.recipient)
    const amountIn: string = toHex(trade.maximumAmountIn(options.allowedSlippage))
    const amountOut: string = toHex(trade.minimumAmountOut(options.allowedSlippage))
    const path: string[] = trade.route.path.map(token => token.address)
    const deadline =
      'ttl' in options
        ? `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`
        : `0x${options.deadline.toString(16)}`

    const useFeeOnTransfer = Boolean(options.feeOnTransfer)

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
            operation = useFeeOnTransfer
              ? SWAP_ACTION_EXACT_TOKENS_FOR_ETH_SUPPORTING_FEE_ON_TRANSFER_TOKENS
              : SWAP_ACTION_EXACT_TOKENS_FOR_ETH
          } else {
            operation = useFeeOnTransfer
              ? SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS_SUPPORTING_FEE_ON_TRANSFER_TOKENS
              : SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS
          }

          // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline, bool uwrap)
          ethItemArgs = web3.eth.abi.encodeParameters(
            ["uint256", "bytes"],
            [operation, web3.eth.abi.encodeParameters(
              ["uint", "uint", "address[]", "address", "uint", "bool"],
              [amountIn, amountOut, path, to, deadline, needUnwrap]
            )]
          )
          args = [to, PROXY_ADDRESS, objectId ?? "0", amountIn, ethItemArgs]
          value = ZERO_HEX

          break
        case TradeType.EXACT_OUTPUT:
          invariant(!useFeeOnTransfer, 'EXACT_OUT_FOT')

          if (etherOut) {
            operation = SWAP_ACTION_TOKENS_FOR_EXACT_ETH
          } else {
            operation = SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS
          }

          // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline, bool uwrap)
          ethItemArgs = web3.eth.abi.encodeParameters(
            ["uint256", "bytes"],
            [operation, web3.eth.abi.encodeParameters(
              ["uint", "uint", "address[]", "address", "uint", "bool"],
              [amountOut, amountIn, path, to, deadline, needUnwrap]
            )]
          )
          args = [to, PROXY_ADDRESS, objectId ?? "0", amountIn, ethItemArgs]
          value = ZERO_HEX

          break
      }
    }
    else {
      switch (trade.tradeType) {
        case TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'
            // (uint amountOutMin, address[] calldata path, address to, uint deadline, bool uwrap, bool callback)
            args = [amountOut, path, to, deadline, needUnwrap, false]
            value = amountIn
          } else if (etherOut) {
            methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'
            // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline, bool uwrap, bool callback)
            args = [amountIn, amountOut, path, to, deadline, needUnwrap, false]
            value = ZERO_HEX
          } else {
            methodName = useFeeOnTransfer
              ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
              : 'swapExactTokensForTokens'
            // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline, bool unwrap, bool callback)
            args = [amountIn, amountOut, path, to, deadline, needUnwrap, false]
            value = ZERO_HEX
          }
          break
        case TradeType.EXACT_OUTPUT:
          invariant(!useFeeOnTransfer, 'EXACT_OUT_FOT')
          if (etherIn) {
            methodName = 'swapETHForExactTokens'
            // (uint amountOut, address[] calldata path, address to, uint deadline, bool unwrap, bool callback)
            args = [amountOut, path, to, deadline, needUnwrap, false]
            value = amountIn
          } else if (etherOut) {
            methodName = 'swapTokensForExactETH'
            // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline, bool unwrap, bool callback)
            args = [amountOut, amountIn, path, to, deadline, needUnwrap, false]
            value = ZERO_HEX
          } else {
            methodName = 'swapTokensForExactTokens'
            // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline, bool unwrap, bool callback)
            args = [amountOut, amountIn, path, to, deadline, needUnwrap, false]
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
}
