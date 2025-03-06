import { SignDataPayload } from '@tonconnect/protocol';

export type SignDataResponse = {
    signature: string;
    address: string;
    timestamp: string;
    domain: string;
    payload: SignDataPayload;
};
