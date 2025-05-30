import { WalletResponseTemplateError } from './wallet-response-template';

export type UnsubscribeV2RpcResponse =
    | UnsubscribeV2RpcResponseSuccess
    | UnsubscribeV2RpcResponseError;

export interface UnsubscribeV2RpcResponseSuccess {
    result: {
        extensionAddress: string;
    };
    id: string;
}

export interface UnsubscribeV2RpcResponseError extends WalletResponseTemplateError {
    error: { code: UNSUBSCRIBE_ERROR_CODES; message: string; data?: unknown };
}

export enum UNSUBSCRIBE_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    BAD_REQUEST_ERROR = 1,
    UNKNOWN_APP_ERROR = 100,
    USER_REJECTS_ERROR = 300,
    METHOD_NOT_SUPPORTED = 400,
    EXTENSION_NOT_FOUND = 404
}
