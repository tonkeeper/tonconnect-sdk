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
    SubscribeV2RpcResponseError,
    SubscribeV2RpcResponseSuccess
} from './subscribe-v2-rpc-response';
import {
    UnsubscribeV2RpcResponseError,
    UnsubscribeV2RpcResponseSuccess
} from './unsubscribe-v2-rpc-response';

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

    subscribeV2: {
        error: SubscribeV2RpcResponseError;
        success: SubscribeV2RpcResponseSuccess;
    };

    unsubscribeV2: {
        error: UnsubscribeV2RpcResponseError;
        success: UnsubscribeV2RpcResponseSuccess;
    };
};

export type WalletResponseSuccess<T extends RpcMethod> = RpcResponses[T]['success'];

export type WalletResponseError<T extends RpcMethod> = RpcResponses[T]['error'];

export type WalletResponse<T extends RpcMethod> = WalletResponseSuccess<T> | WalletResponseError<T>;
