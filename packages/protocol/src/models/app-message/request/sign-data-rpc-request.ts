export interface SignDataRpcRequest {
    id: string;
    params: SignDataRequestPayload;
    method: 'signData';
}

export type SignDataRequestPayload = { address: string } & SignDataRequestPayloadKind;

type SignDataRequestPayloadKind =
    | SignDataRequestPayloadText
    | SignDataRequestPayloadBinary
    | SignDataRequestPayloadCell;

type SignDataRequestPayloadText = {
    type: 'text';
    layout: 'plaintext' | 'markdown';
    text: string; // arbitrary UTF-8 string
};
type SignDataRequestPayloadBinary = {
    type: 'binary';
    bytes: string; // base64 (not url safe) encoded bytes array
};
type SignDataRequestPayloadCell = {
    type: 'cell';
    schema: string; // TL-B scheme of the cell payload
    cell: string; // base64 (not url safe) encoded cell
};
