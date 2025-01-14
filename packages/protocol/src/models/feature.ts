export type Feature = SendTransactionFeatureDeprecated | SendTransactionFeature | SignDataFeature;

export type SendTransactionFeatureDeprecated = 'SendTransaction';
export type SendTransactionFeature = { name: 'SendTransaction'; maxMessages: number };

type SignDataTypes = 'text' | 'binary' | 'cell';
export type SignDataFeature = { name: 'SignData'; types: SignDataTypes[] };
