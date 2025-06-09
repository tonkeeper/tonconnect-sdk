import { SignDataType } from "@tonconnect/protocol";

/**
 * Required features for wallets.
 */
export type RequiredFeatures = {
    /**
     * Required features for the send transaction feature.
     */
    sendTransaction?: RequiredSendTransactionFeature;
    signData?: RequiredSignDataFeature;
    subscription?: RequiredSubscriptionFeature;
};


/**
 * Required features for the send transaction feature.
 */
export type RequiredSendTransactionFeature = {
    /**
     * Minimum number of messages to send.
     */
    minMessages?: number;

    /**
     * Whether extra currency is required.
     */
    extraCurrencyRequired?: boolean;
};

/**
 * Required features for the sign data feature.
 */
export type RequiredSignDataFeature = {
    /**
     * Supported sign data types.
     */
    types: SignDataType[];
};


/**
 * Required features for the subscription feature.
 */
export type RequiredSubscriptionFeature = {
    versions?: 'v2'[]
};