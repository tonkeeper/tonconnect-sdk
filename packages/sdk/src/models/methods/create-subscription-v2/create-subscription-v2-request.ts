import { CHAIN } from '@tonconnect/protocol';

/**
 * Subscription metadata
 */
export interface SubscriptionV2Metadata {
    /** Logo URL */
    logo: string;
    /** Subscription name */
    name: string;
    /** Subscription description */
    description: string;
    /** Subscription link */
    link: string;
    /** Terms of service */
    tos: string;
    /** Merchant name */
    merchant: string;
    /** Website */
    website: string;
    /** Category (optional) */
    category?: string;
}

export interface CreateSubscriptionV2Details {
    /** Subscription UUID defined by merchant */
    id: string;
    /** Beneficiary address */
    beneficiary: string;
    /** Amount in nanoTON */
    amount: string;
    /** Subscription period in seconds */
    period: number;
    /** First charging date (optional) */
    firstChargeDate?: number;
    /** Subscription metadata */
    metadata: SubscriptionV2Metadata;
}

export interface CreateSubscriptionV2Request {
    /**
     * Sending transaction deadline in unix epoch seconds.
     */
    validUntil: number;

    /**
     * The network (mainnet or testnet) where DApp intends to send the transaction. If not set, the transaction is sent to the network currently set in the wallet, but this is not safe and DApp should always strive to set the network. If the network parameter is set, but the wallet has a different network set, the wallet should show an alert and DO NOT ALLOW TO SEND this transaction.
     */
    network?: CHAIN;

    /**
     * The sender address in '<wc>:<hex>' format from which DApp intends to send the transaction. Current account.address by default.
     */
    from?: string;

    /** Subscription metadata */
    subscription: CreateSubscriptionV2Details;
}
