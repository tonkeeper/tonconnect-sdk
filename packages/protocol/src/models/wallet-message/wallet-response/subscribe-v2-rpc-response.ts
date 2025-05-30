import { WalletResponseTemplateError } from './wallet-response-template';

export type SubscribeV2RpcResponse = SubscribeV2RpcResponseSuccess | SubscribeV2RpcResponseError;

export interface SubscribeV2RpcResponseSuccess {
    result: {
        extensionAddress: string;
    };
    id: string;
}

export interface SubscribeV2RpcResponseError extends WalletResponseTemplateError {
    error: { code: SUBSCRIBE_ERROR_CODES; message: string; data?: unknown };
}

export enum SUBSCRIBE_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    BAD_REQUEST_ERROR = 1,
    UNKNOWN_APP_ERROR = 100,
    USER_REJECTS_ERROR = 300,
    METHOD_NOT_SUPPORTED = 400
}
