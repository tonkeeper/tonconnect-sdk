import { WalletResponseTemplateError } from './wallet-response-template';

export type CreateSubscriptionV2RpcResponse =
    | CreateSubscriptionV2RpcResponseSuccess
    | CreateSubscriptionV2RpcResponseError;

export interface CreateSubscriptionV2RpcResponseSuccess {
    result: {
        extensionAddress: string;
    };
    id: string;
}

export interface CreateSubscriptionV2RpcResponseError extends WalletResponseTemplateError {
    error: { code: CREATE_SUBSCRIPTION_V2_ERROR_CODES; message: string; data?: unknown };
}

export enum CREATE_SUBSCRIPTION_V2_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    BAD_REQUEST_ERROR = 1,
    UNKNOWN_APP_ERROR = 100,
    USER_REJECTS_ERROR = 300,
    METHOD_NOT_SUPPORTED = 400
}
