import { Percent, Token, Trade } from './entities';
/**
 * Options for producing the arguments to send call to the router.
 */
export interface TradeOptions {
    /**
     * How much the execution price is allowed to move unfavorably from the trade execution price.
     */
    allowedSlippage: Percent;
    /**
     * How long the swap is valid until it expires, in seconds.
     * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
     * are generated.
     */
    ttl: number;
    /**
     * The account that should receive the output of the swap.
     */
    recipient: string;
    /**
     * Whether any of the tokens in the path are fee on transfer tokens, which should be handled with special methods
     */
    feeOnTransfer?: boolean;
}
export interface TradeOptionsDeadline extends Omit<TradeOptions, 'ttl'> {
    /**
     * When the transaction expires.
     * This is an atlernate to specifying the ttl, for when you do not want to use local time.
     */
    deadline: number;
}
/**
 * The parameters to use in the call to the Materia Router to execute a trade.
 */
export interface SwapParameters {
    /**
     * The method to call on the Materia Router.
     */
    methodName: string;
    /**
     * The arguments to pass to the method, all hex encoded.
     */
    args: (string | string[])[];
    /**
     * The amount of wei to send in hex.
     */
    value: string;
}
/**
 * Represents the Materia Router, and has static methods for helping execute trades.
 */
export declare abstract class Router {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     * @param tokenIn input token address
     * @param tokenOut output token address
     * @param etherIn input currency is ETH
     * @param etherOut output currency is ETH
     * @param isEthItem flag for check if is EthItem
     * @param needEthItemDecimalsAdjustment flag for check if the value need EthItem (Native/Wrapped 721/Wrapped 1155) decimals adjustment
     * @param objectId objectId for the EthItem
     * @param ethItemDecimals decimals if the token need EthItem decimals adjustment
     */
    static swapCallParameters(trade: Trade, options: TradeOptions | TradeOptionsDeadline, tokenIn: Token, tokenOut: Token, etherIn: Boolean, etherOut: Boolean, isEthItem: boolean, needEthItemDecimalsAdjustment: boolean, objectId: string | null, ethItemDecimals: number | null): SwapParameters;
    private static adjustTokenAmount;
    private static decodeInteroperableValueToERC20TokenAmount;
    private static formatEthItemTokenValue;
}
