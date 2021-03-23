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
export declare const FACTORY_ADDRESS = "0x0842c3E3ff99AEb1984A356dCd4b8c1812C82189";
export declare const ORCHESTRATOR_ADDRESS = "0x7e9E11a1e28aF8F7F0d7c730290e6A2913C13068";
export declare const INIT_CODE_HASH = "0x1974917c1e01e6369c1b45f631eae6a71d24cb5108c460cc7f0b1c608b3a7c94";
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
