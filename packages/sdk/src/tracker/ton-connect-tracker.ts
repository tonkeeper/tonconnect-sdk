import {
    createConnectionCompletedEvent,
    createConnectionErrorEvent,
    createConnectionRestoringCompletedEvent,
    createConnectionRestoringErrorEvent,
    createConnectionRestoringStartedEvent,
    createConnectionStartedEvent,
    createDisconnectionEvent,
    createRequestVersionEvent,
    createResponseVersionEvent,
    createDataSentForSignatureEvent,
    createDataSignedEvent,
    createDataSigningFailedEvent,
    createTransactionSentForSignatureEvent,
    createTransactionSignedEvent,
    createTransactionSigningFailedEvent,
    createSubscriptionV2CreationCompletedEvent,
    createSubscriptionV2CreationInitiatedEvent,
    createSubscriptionV2CreationFailedEvent,
    createSubscriptionV2CancellationInitiatedEvent,
    createSubscriptionV2CancellationCompletedEvent,
    createSubscriptionV2CancellationFailedEvent,
    createVersionInfo,
    ResponseVersionEvent,
    SdkActionEvent,
    Version,
    WithoutVersion
} from './types';
import { EventDispatcher } from 'src/tracker/event-dispatcher';
import { BrowserEventDispatcher } from 'src/tracker/browser-event-dispatcher';

/**
 * Options for the TonConnect tracker.
 */
export type TonConnectTrackerOptions = {
    /**
     * Event dispatcher to track user actions.
     * @default new BrowserEventDispatcher()
     */
    eventDispatcher?: EventDispatcher<SdkActionEvent> | null;
    /**
     * TonConnect SDK version.
     */
    tonConnectSdkVersion: string;
};

/**
 * Tracker for TonConnect user actions, such as transaction signing, connection, etc.
 *
 * List of events:
 *  * `connection-started`: when a user starts connecting a wallet.
 *  * `connection-completed`: when a user successfully connected a wallet.
 *  * `connection-error`: when a user cancels a connection or there is an error during the connection process.
 *  * `connection-restoring-started`: when the dApp starts restoring a connection.
 *  * `connection-restoring-completed`: when the dApp successfully restores a connection.
 *  * `connection-restoring-error`: when the dApp fails to restore a connection.
 *  * `disconnection`: when a user starts disconnecting a wallet.
 *  * `transaction-sent-for-signature`: when a user sends a transaction for signature.
 *  * `transaction-signed`: when a user successfully signs a transaction.
 *  * `transaction-signing-failed`: when a user cancels transaction signing or there is an error during the signing process.
 *  * `sign-data-request-initiated`: when a user sends data for signature.
 *  * `sign-data-request-completed`: when a user successfully signs data.
 *  * `sign-data-request-failed`: when a user cancels data signing or there is an error during the signing process.
 *  * `create-subscription-v2-initiated`: when a user starts creating a subscription.
 *  * `create-subscription-v2-completed`: when a user successfully creates a subscription.
 *  * `create-subscription-v2-failed`: when a user cancels subscription creation or there is an error during the creation process.
 *  * `cancel-subscription-v2-initiated`: when a user starts canceling a subscription.
 *  * `cancel-subscription-v2-completed`: when a user successfully cancels a subscription.
 *  * `cancel-subscription-v2-failed`: when a user cancels subscription cancellation or there is an error during the cancellation process.
 *
 * If you want to track user actions, you can subscribe to the window events with prefix `ton-connect-`:
 *
 * @example
 * window.addEventListener('ton-connect-transaction-sent-for-signature', (event) => {
 *    console.log('Transaction init', event.detail);
 * });
 *
 * @internal
 */
export class TonConnectTracker {
    /**
     * Event prefix for user actions.
     * @private
     */
    private readonly eventPrefix = 'ton-connect-';

    /**
     * TonConnect SDK version.
     */
    private readonly tonConnectSdkVersion: string;

    /**
     * TonConnect UI version.
     */
    private tonConnectUiVersion: string | null = null;

    /**
     * Version of the library.
     */
    get version(): Version {
        return createVersionInfo({
            ton_connect_sdk_lib: this.tonConnectSdkVersion,
            ton_connect_ui_lib: this.tonConnectUiVersion
        });
    }

    /**
     * Event dispatcher to track user actions. By default, it uses `window.dispatchEvent` for browser environment.
     * @private
     */
    private readonly eventDispatcher: EventDispatcher<SdkActionEvent>;

    constructor(options: TonConnectTrackerOptions) {
        this.eventDispatcher = options?.eventDispatcher ?? new BrowserEventDispatcher();
        this.tonConnectSdkVersion = options.tonConnectSdkVersion;

        this.init().catch();
    }

    /**
     * Called once when the tracker is created and request version other libraries.
     */
    private async init(): Promise<void> {
        try {
            await this.setRequestVersionHandler();
            this.tonConnectUiVersion = await this.requestTonConnectUiVersion();
        } catch (e) {}
    }

    /**
     * Set request version handler.
     * @private
     */
    private async setRequestVersionHandler(): Promise<void> {
        await this.eventDispatcher.addEventListener('ton-connect-request-version', async () => {
            await this.eventDispatcher.dispatchEvent(
                'ton-connect-response-version',
                createResponseVersionEvent(this.tonConnectSdkVersion)
            );
        });
    }

    /**
     * Request TonConnect UI version.
     * @private
     */
    private async requestTonConnectUiVersion(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.eventDispatcher.addEventListener(
                    'ton-connect-ui-response-version',
                    (event: CustomEvent<ResponseVersionEvent>) => {
                        resolve(event.detail.version);
                    },
                    { once: true }
                );

                await this.eventDispatcher.dispatchEvent(
                    'ton-connect-ui-request-version',
                    createRequestVersionEvent()
                );
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Emit user action event to the window.
     * @param eventDetails
     * @private
     */
    private dispatchUserActionEvent(eventDetails: SdkActionEvent): void {
        try {
            this.eventDispatcher
                .dispatchEvent(`${this.eventPrefix}${eventDetails.type}`, eventDetails)
                .catch();
        } catch (e) {}
    }

    /**
     * Track connection init event.
     * @param args
     */
    public trackConnectionStarted(
        ...args: WithoutVersion<Parameters<typeof createConnectionStartedEvent>>
    ): void {
        try {
            const event = createConnectionStartedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track connection success event.
     * @param args
     */
    public trackConnectionCompleted(
        ...args: WithoutVersion<Parameters<typeof createConnectionCompletedEvent>>
    ): void {
        try {
            const event = createConnectionCompletedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track connection error event.
     * @param args
     */
    public trackConnectionError(
        ...args: WithoutVersion<Parameters<typeof createConnectionErrorEvent>>
    ): void {
        try {
            const event = createConnectionErrorEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track connection restoring init event.
     * @param args
     */
    public trackConnectionRestoringStarted(
        ...args: WithoutVersion<Parameters<typeof createConnectionRestoringStartedEvent>>
    ): void {
        try {
            const event = createConnectionRestoringStartedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track connection restoring success event.
     * @param args
     */
    public trackConnectionRestoringCompleted(
        ...args: WithoutVersion<Parameters<typeof createConnectionRestoringCompletedEvent>>
    ): void {
        try {
            const event = createConnectionRestoringCompletedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track connection restoring error event.
     * @param args
     */
    public trackConnectionRestoringError(
        ...args: WithoutVersion<Parameters<typeof createConnectionRestoringErrorEvent>>
    ): void {
        try {
            const event = createConnectionRestoringErrorEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track disconnect event.
     * @param args
     */
    public trackDisconnection(
        ...args: WithoutVersion<Parameters<typeof createDisconnectionEvent>>
    ): void {
        try {
            const event = createDisconnectionEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track transaction init event.
     * @param args
     */
    public trackTransactionSentForSignature(
        ...args: WithoutVersion<Parameters<typeof createTransactionSentForSignatureEvent>>
    ): void {
        try {
            const event = createTransactionSentForSignatureEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track transaction signed event.
     * @param args
     */
    public trackTransactionSigned(
        ...args: WithoutVersion<Parameters<typeof createTransactionSignedEvent>>
    ): void {
        try {
            const event = createTransactionSignedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track transaction error event.
     * @param args
     */
    public trackTransactionSigningFailed(
        ...args: WithoutVersion<Parameters<typeof createTransactionSigningFailedEvent>>
    ): void {
        try {
            const event = createTransactionSigningFailedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track sign data init event.
     * @param args
     */
    public trackDataSentForSignature(
        ...args: WithoutVersion<Parameters<typeof createDataSentForSignatureEvent>>
    ): void {
        try {
            const event = createDataSentForSignatureEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track sign data success event.
     * @param args
     */
    public trackDataSigned(
        ...args: WithoutVersion<Parameters<typeof createDataSignedEvent>>
    ): void {
        try {
            const event = createDataSignedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track sign data error event.
     * @param args
     */
    public trackDataSigningFailed(
        ...args: WithoutVersion<Parameters<typeof createDataSigningFailedEvent>>
    ): void {
        try {
            const event = createDataSigningFailedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track subscription creation event initiated.
     * @param args
     */
    public trackCreateSubscriptionV2Initiated(
        ...args: WithoutVersion<Parameters<typeof createSubscriptionV2CreationInitiatedEvent>>
    ): void {
        try {
            const event = createSubscriptionV2CreationInitiatedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track subscription created event.
     * @param args
     */
    public trackCreateSubscriptionV2Completed(
        ...args: WithoutVersion<Parameters<typeof createSubscriptionV2CreationCompletedEvent>>
    ): void {
        try {
            const event = createSubscriptionV2CreationCompletedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track subscription creation failed event.
     * @param args
     */
    public trackCreateSubscriptionV2Failed(
        ...args: WithoutVersion<Parameters<typeof createSubscriptionV2CreationFailedEvent>>
    ): void {
        try {
            const event = createSubscriptionV2CreationFailedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track subscription cancellation event initiated.
     * @param args
     */
    public trackCancelSubscriptionV2Initiated(
        ...args: WithoutVersion<Parameters<typeof createSubscriptionV2CancellationInitiatedEvent>>
    ): void {
        try {
            const event = createSubscriptionV2CancellationInitiatedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track subscription canceled event.
     * @param args
     */
    public trackCancelSubscriptionV2Completed(
        ...args: WithoutVersion<Parameters<typeof createSubscriptionV2CancellationCompletedEvent>>
    ): void {
        try {
            const event = createSubscriptionV2CancellationCompletedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }

    /**
     * Track subscription cancellation failed event.
     * @param args
     */
    public trackCancelSubscriptionV2Failed(
        ...args: WithoutVersion<Parameters<typeof createSubscriptionV2CancellationFailedEvent>>
    ): void {
        try {
            const event = createSubscriptionV2CancellationFailedEvent(this.version, ...args);
            this.dispatchUserActionEvent(event);
        } catch (e) {}
    }
}
