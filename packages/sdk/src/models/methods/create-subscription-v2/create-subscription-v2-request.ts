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

export interface CreateSubscriptionV2Request {
    /** Beneficiary address */
    beneficiary: string;
    /** Subscription ID */
    subscriptionId: number;
    /** Subscription period in seconds */
    period: number;
    /** Payment amount in TON */
    paymentAmount: string;
    /** First charging date (optional) */
    firstChargingDate?: number;
    /** Subscription metadata */
    metadata: SubscriptionV2Metadata;
}
