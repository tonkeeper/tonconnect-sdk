import { WalletResponseTemplateError } from './wallet-response-template';

export type CancelSubscriptionV2RpcResponse =
    | CancelSubscriptionV2RpcResponseSuccess
    | CancelSubscriptionV2RpcResponseError;

export interface CancelSubscriptionV2RpcResponseSuccess {
    result: { boc: string };
    id: string;
}

export interface CancelSubscriptionV2RpcResponseError extends WalletResponseTemplateError {
    error: { code: CANCEL_SUBSCRIPTION_V2_ERROR_CODES; message: string; data?: unknown };
}

export enum CANCEL_SUBSCRIPTION_V2_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    BAD_REQUEST_ERROR = 1,
    UNKNOWN_APP_ERROR = 100,
    USER_REJECTS_ERROR = 300,
    METHOD_NOT_SUPPORTED = 400,
    EXTENSION_NOT_FOUND = 404
}
