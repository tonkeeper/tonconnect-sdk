import {
    ConnectionEvent,
    ConnectionRestoringEvent,
    DisconnectionEvent,
    TransactionSigningEvent,
    DataSigningEvent,
    CreateSubscriptionV2Event,
    CancelSubscriptionV2Event,
    VersionEvent
} from '@tonconnect/sdk';

/**
 * User action events.
 */
export type UserActionEvent =
    | VersionEvent
    | ConnectionEvent
    | ConnectionRestoringEvent
    | DisconnectionEvent
    | TransactionSigningEvent
    | DataSigningEvent
    | CreateSubscriptionV2Event
    | CancelSubscriptionV2Event;

export {
    createRequestVersionEvent,
    createResponseVersionEvent,
    createConnectionStartedEvent,
    createConnectionErrorEvent,
    createConnectionCompletedEvent,
    createConnectionRestoringStartedEvent,
    createConnectionRestoringErrorEvent,
    createConnectionRestoringCompletedEvent,
    createDisconnectionEvent,
    createTransactionSentForSignatureEvent,
    createTransactionSigningFailedEvent,
    createTransactionSignedEvent
} from '@tonconnect/sdk';
