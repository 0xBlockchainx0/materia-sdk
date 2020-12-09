import JSBI from 'jsbi';
export declare type BigintIsh = JSBI | bigint | string;
export declare enum ChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GÖRLI = 5,
    KOVAN = 42
}
export declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
export declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
export declare const PROXY_ADDRESS = "0xb19f100c3c02ac469874c8c3a1038c7007950d81";
export declare const FACTORY_ADDRESS = "0x902e7cdDB4821c30B4A8FD7F8FDF62c439AA0657";
export declare const INIT_CODE_HASH = "0xf79c9250dcc326869d68244ec72bf9db8eef77e832de86e4ddb5d4aa37376d68";
export declare const MINIMUM_LIQUIDITY: JSBI;
export declare const ZERO: JSBI;
export declare const ONE: JSBI;
export declare const TWO: JSBI;
export declare const THREE: JSBI;
export declare const FIVE: JSBI;
export declare const TEN: JSBI;
export declare const _100: JSBI;
export declare const _997: JSBI;
export declare const _1000: JSBI;
export declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
export declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: JSBI;
    uint256: JSBI;
};
export declare const SWAP_ACTION_EXACT_TOKENS_FOR_ETH_SUPPORTING_FEE_ON_TRANSFER_TOKENS = 1;
export declare const SWAP_ACTION_EXACT_TOKENS_FOR_ETH = 2;
export declare const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS_SUPPORTING_FEE_ON_TRANSFER_TOKENS = 3;
export declare const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS = 4;
export declare const SWAP_ACTION_TOKENS_FOR_EXACT_ETH = 5;
export declare const SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS = 6;
