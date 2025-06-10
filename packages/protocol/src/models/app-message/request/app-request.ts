import { SendTransactionRpcRequest } from './send-transaction-rpc-request';
import { SignDataRpcRequest } from './sign-data-rpc-request';
import { RpcMethod } from '../../rpc-method';
import { DisconnectRpcRequest } from './disconnect-rpc-request';
import { CreateSubscriptionV2RpcRequest } from './create-subscription-v2-rpc-request';
import { CancelSubscriptionV2RpcRequest } from './cancel-subscription-v2-rpc-request';

export type RpcRequests = {
    sendTransaction: SendTransactionRpcRequest;
    signData: SignDataRpcRequest;
    disconnect: DisconnectRpcRequest;
    createSubscriptionV2: CreateSubscriptionV2RpcRequest;
    cancelSubscriptionV2: CancelSubscriptionV2RpcRequest;
};

export type AppRequest<T extends RpcMethod> = RpcRequests[T];
