export interface CreateSubscriptionV2Response {
    /**
     * Subscription extension address (Bag of Cells)
     */
    boc: string;
    /**
     * Parsed extension address for convenience
     */
    // TODO: remove this property for release, only for testing purposes
    extensionAddress?: string;
}
