import { SendTransactionRpcRequest } from './send-transaction-rpc-request';
import { SignDataRpcRequest } from './sign-data-rpc-request';
import { RpcMethod } from '../../rpc-method';
import { DisconnectRpcRequest } from './disconnect-rpc-request';
import { SubscribeV2RpcRequest } from './subscribe-v2-rpc-request';
import { UnsubscribeV2RpcRequest } from './unsubscribe-v2-rpc-request';

export type RpcRequests = {
    sendTransaction: SendTransactionRpcRequest;
    signData: SignDataRpcRequest;
    disconnect: DisconnectRpcRequest;
    subscribeV2: SubscribeV2RpcRequest;
    unsubscribeV2: UnsubscribeV2RpcRequest;
};

export type AppRequest<T extends RpcMethod> = RpcRequests[T];
