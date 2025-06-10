export type Feature =
    | SendTransactionFeatureDeprecated
    | SendTransactionFeature
    | SignDataFeature
    | SubscriptionFeature;

export type FeatureName = Exclude<Feature, 'SendTransaction'>['name'];

export type SendTransactionFeatureDeprecated = 'SendTransaction';
export type SendTransactionFeature = {
    name: 'SendTransaction';
    maxMessages: number;
    extraCurrencySupported?: boolean;
};

export type SignDataType = 'text' | 'binary' | 'cell';
export type SignDataFeature = { name: 'SignData'; types: SignDataType[] };

export type SubscriptionFeature = {
    name: 'Subscription';
    versions: 2[];
};
