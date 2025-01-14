import { SignDataRequest } from "./sign-data-request";

export type SignDataResponse = SignDataResponseSuccess | SignDataResponseError;

interface SignDataResponseSuccess {
    result: {
      signature: string; // base64 encoded signature
      address: string;   // wallet address
      timestamp: string; // UNIX timestamp in seconds (UTC) at the moment on creating the signature.
      domain: string;  // app domain name (as url part, without encoding) 
      payload: SignDataRequest; // payload that was signed
    };
    id: string;
}

interface SignDataResponseError {
   error: { code: number; message: string };
   id: string;
}