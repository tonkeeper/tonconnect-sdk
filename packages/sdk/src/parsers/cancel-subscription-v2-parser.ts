import {
    CANCEL_SUBSCRIPTION_V2_ERROR_CODES,
    CancelSubscriptionV2RpcRequest,
    CancelSubscriptionV2RpcResponseError,
    CancelSubscriptionV2RpcResponseSuccess
} from '@tonconnect/protocol';
import { BadRequestError, TonConnectError, UnknownAppError, UserRejectsError } from 'src/errors';
import { UnknownError } from 'src/errors/unknown.error';
import {
    CancelSubscriptionV2Request,
    CancelSubscriptionV2Response
} from 'src/models/methods/cancel-subscription-v2';
import { RpcParser } from 'src/parsers/rpc-parser';
import { WithoutId } from 'src/utils/types';

const cancelSubscriptionV2Errors: Partial<
    Record<CANCEL_SUBSCRIPTION_V2_ERROR_CODES, typeof TonConnectError>
> = {
    [CANCEL_SUBSCRIPTION_V2_ERROR_CODES.UNKNOWN_ERROR]: UnknownError,
    [CANCEL_SUBSCRIPTION_V2_ERROR_CODES.USER_REJECTS_ERROR]: UserRejectsError,
    [CANCEL_SUBSCRIPTION_V2_ERROR_CODES.BAD_REQUEST_ERROR]: BadRequestError,
    [CANCEL_SUBSCRIPTION_V2_ERROR_CODES.UNKNOWN_APP_ERROR]: UnknownAppError
};

export class CancelSubscriptionV2Parser extends RpcParser<'cancelSubscriptionV2'> {
    convertToRpcRequest(
        request: Omit<CancelSubscriptionV2Request, 'validUntil' | 'extensionAddress'> & {
            valid_until: number;
            extension_address: CancelSubscriptionV2Request['extensionAddress'];
        }
    ): WithoutId<CancelSubscriptionV2RpcRequest> {
        return {
            method: 'cancelSubscriptionV2',
            params: [JSON.stringify(request)]
        };
    }

    parseAndThrowError(response: WithoutId<CancelSubscriptionV2RpcResponseError>): never {
        let ErrorConstructor: typeof TonConnectError = UnknownError;
        if (response.error.code in cancelSubscriptionV2Errors) {
            ErrorConstructor = cancelSubscriptionV2Errors[response.error.code] || UnknownError;
        }
        throw new ErrorConstructor(response.error.message);
    }

    convertFromRpcResponse(
        rpcResponse: WithoutId<CancelSubscriptionV2RpcResponseSuccess>
    ): CancelSubscriptionV2Response {
        return rpcResponse.result;
    }
}

export const cancelSubscriptionV2Parser = new CancelSubscriptionV2Parser();
