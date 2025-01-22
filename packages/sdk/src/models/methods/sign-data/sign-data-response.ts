import { SignDataPayload } from '@tonconnect/protocol';

export type SignDataResponse = {
    signature: string; // base64 encoded signature
    address: string; // wallet address
    timestamp: string; // UNIX timestamp in seconds (UTC) at the moment on creating the signature.
    domain: string; // app domain name (as url part, without encoding)
    payload: SignDataPayload; // payload that was signed
};
