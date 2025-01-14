import { SignDataRequestPayload } from 'src/models/app-message/request/sign-data-rpc-request'; // TODO: Check if this import is correct
import { WalletResponseTemplateError } from './wallet-response-template';

export type SignDataRpcResponse = SignDataRpcResponseSuccess | SignDataRpcResponseError;
// export type SignDataRpcResponse = SignDataResponseSuccess | SignDataResponseError;

export interface SignDataRpcResponseSuccess {
    result: {
        signature: string; // base64 encoded signature
        address: string; // wallet address
        timestamp: string; // UNIX timestamp in seconds (UTC) at the moment on creating the signature.
        domain: string; // app domain name (as url part, without encoding)
        payload: SignDataRequestPayload; // payload that was signed
    };
    id: string;
}

export interface SignDataRpcResponseError extends WalletResponseTemplateError {
    error: { code: SIGN_DATA_ERROR_CODES; message: string };
    id: string;
}

export enum SIGN_DATA_ERROR_CODES {
    UNKNOWN_ERROR = 0,
    BAD_REQUEST_ERROR = 1,
    UNKNOWN_APP_ERROR = 100,
    USER_REJECTS_ERROR = 300,
    METHOD_NOT_SUPPORTED = 400
}
