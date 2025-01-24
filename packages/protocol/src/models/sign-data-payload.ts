export type SignDataPayload = { address: string } & (
    | SignDataPayloadText
    | SignDataPayloadBinary
    | SignDataPayloadCell
);

export type SignDataPayloadText = {
    type: 'text';
    layout: 'plaintext' | 'markdown';
    text: string; // arbitrary UTF-8 string
};
export type SignDataPayloadBinary = {
    type: 'binary';
    bytes: string; // base64 (not url safe) encoded bytes array
};
export type SignDataPayloadCell = {
    type: 'cell';
    schema: string; // TL-B scheme of the cell payload
    cell: string; // base64 (not url safe) encoded cell
};
