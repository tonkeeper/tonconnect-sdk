import {
    CREATE_SUBSCRIPTION_V2_ERROR_CODES,
    CreateSubscriptionV2RpcRequest,
    CreateSubscriptionV2RpcResponseError,
    CreateSubscriptionV2RpcResponseSuccess
} from '@tonconnect/protocol';
import { BadRequestError, TonConnectError, UnknownAppError, UserRejectsError } from 'src/errors';
import { UnknownError } from 'src/errors/unknown.error';
import {
    CreateSubscriptionV2Request,
    CreateSubscriptionV2Response
} from 'src/models/methods/create-subscription-v2';
import { RpcParser } from 'src/parsers/rpc-parser';
import { WithoutId } from 'src/utils/types';

const createSubscriptionV2Errors: Partial<
    Record<CREATE_SUBSCRIPTION_V2_ERROR_CODES, typeof TonConnectError>
> = {
    [CREATE_SUBSCRIPTION_V2_ERROR_CODES.UNKNOWN_ERROR]: UnknownError,
    [CREATE_SUBSCRIPTION_V2_ERROR_CODES.USER_REJECTS_ERROR]: UserRejectsError,
    [CREATE_SUBSCRIPTION_V2_ERROR_CODES.BAD_REQUEST_ERROR]: BadRequestError,
    [CREATE_SUBSCRIPTION_V2_ERROR_CODES.UNKNOWN_APP_ERROR]: UnknownAppError
};

export class CreateSubscriptionV2Parser extends RpcParser<'createSubscriptionV2'> {
    convertToRpcRequest(
        payload: CreateSubscriptionV2Request
    ): WithoutId<CreateSubscriptionV2RpcRequest> {
        return {
            method: 'createSubscriptionV2',
            params: [JSON.stringify(payload)]
        };
    }

    parseAndThrowError(response: WithoutId<CreateSubscriptionV2RpcResponseError>): never {
        let ErrorConstructor: typeof TonConnectError = UnknownError;
        if (response.error.code in createSubscriptionV2Errors) {
            ErrorConstructor = createSubscriptionV2Errors[response.error.code] || UnknownError;
        }
        throw new ErrorConstructor(response.error.message);
    }

    convertFromRpcResponse(
        rpcResponse: WithoutId<CreateSubscriptionV2RpcResponseSuccess>
    ): CreateSubscriptionV2Response {
        return rpcResponse.result;
    }
}

export const createSubscriptionV2Parser = new CreateSubscriptionV2Parser();
