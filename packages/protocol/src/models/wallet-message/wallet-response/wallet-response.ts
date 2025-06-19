import { RpcMethod } from '../../rpc-method';
import {
    SendTransactionRpcResponseError,
    SendTransactionRpcResponseSuccess
} from './send-transaction-rpc-response';
import { SignDataRpcResponseError, SignDataRpcResponseSuccess } from './sign-data-rpc-response';
import {
    DisconnectRpcResponseError,
    DisconnectRpcResponseSuccess
} from './disconnect-rpc-response';
import {
    CreateSubscriptionV2RpcResponseError,
    CreateSubscriptionV2RpcResponseSuccess
} from './create-subscription-v2-rpc-response';
import {
    CancelSubscriptionV2RpcResponseError,
    CancelSubscriptionV2RpcResponseSuccess
} from './cancel-subscription-v2-rpc-response';

export type RpcResponses = {
    sendTransaction: {
        error: SendTransactionRpcResponseError;
        success: SendTransactionRpcResponseSuccess;
    };

    signData: {
        error: SignDataRpcResponseError;
        success: SignDataRpcResponseSuccess;
    };

    disconnect: {
        error: DisconnectRpcResponseError;
        success: DisconnectRpcResponseSuccess;
    };

    createSubscriptionV2: {
        error: CreateSubscriptionV2RpcResponseError;
        success: CreateSubscriptionV2RpcResponseSuccess;
    };

    cancelSubscriptionV2: {
        error: CancelSubscriptionV2RpcResponseError;
        success: CancelSubscriptionV2RpcResponseSuccess;
    };
};

export type WalletResponseSuccess<T extends RpcMethod> = RpcResponses[T]['success'];

export type WalletResponseError<T extends RpcMethod> = RpcResponses[T]['error'];

export type WalletResponse<T extends RpcMethod> = WalletResponseSuccess<T> | WalletResponseError<T>;
