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
export declare const ChainName: {
    1: string;
    3: string;
    4: string;
    5: string;
    42: string;
};
export declare const FACTORY_ADDRESS = "0xDD9242846aE11Ae6E57170B840cc174a7b9e2f48";
export declare const ORCHESTRATOR_ADDRESS = "0x81B0f3c1B363a44b9c03F868e9B8460c23ce5d1c";
export declare const INIT_CODE_HASH = "0x3a1b8c90f0ece2019085f38a482fb7538bb84471f01b56464ac88dd6bece344e";
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
export declare const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
export declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: JSBI;
    uint256: JSBI;
};
export declare const ADD_LIQUIDITY_ACTION_SAFE_TRANSFER_TOKEN = 1;
export declare const SWAP_ACTION_EXACT_TOKENS_FOR_TOKENS = 2;
export declare const SWAP_ACTION_TOKENS_FOR_EXACT_TOKENS = 3;
export declare const SWAP_ACTION_EXACT_TOKENS_FOR_ETH = 4;
export declare const SWAP_ACTION_TOKENS_FOR_EXACT_ETH = 5;
