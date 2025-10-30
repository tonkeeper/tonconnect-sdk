import { useCallback, useState } from 'react';
import ReactJson from 'react-json-view';
import './style.scss';
import {
    CreateSubscriptionV2Request,
    CreateSubscriptionV2Response,
    CancelSubscriptionV2Request,
    CancelSubscriptionV2Response,
    useTonConnectUI,
    useTonWallet
} from '@tonconnect/ui-react';
import { Cell, loadMessage } from '@ton/core';

/**
 * Parse extension address from BOC (external message)
 * @param boc - Base64 encoded BOC string
 * @returns Extension address in user-friendly format or error message
 */
function parseExtensionAddressFromBoc(boc: string): string {
    try {
        const slice = Cell.fromBase64(boc).beginParse();
        const message = loadMessage(slice);

        // Extract destination address from message info
        if (message.info.type === 'external-out') {
            return message.info.dest?.toString() || 'No destination address found';
        } else if (message.info.type === 'internal') {
            return message.info.dest.toString();
        } else if (message.info.type === 'external-in') {
            return 'External-in message (no destination)';
        }

        return 'Unknown message type';
    } catch (error) {
        return `Error parsing BOC: ${error instanceof Error ? error.message : String(error)}`;
    }
}

const baseSubscriptionPayload: CreateSubscriptionV2Request = {
    validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
    subscription: {
        beneficiary: 'UQCae11h9N5znylEPRjmuLYGvIwnxkcCw4zVW4BJjVASi5eL',
        id: 0,
        period: 1209600, // 2 week
        amount: '100000000',
        firstChargeDate: Math.floor(Date.now() / 1000) + 86400, // 1 day from now
        withdrawAddress: 'UQCae11h9N5znylEPRjmuLYGvIwnxkcCw4zVW4BJjVASi5eL',
        withdrawMsgBody: 'asdsadasdasda',
        metadata: {
            logo: 'https://myapp.com/logo.png',
            name: 'Example Subscription',
            description: 'This is an example subscription service.',
            link: 'https://myapp.com',
            tos: 'https://myapp.com/tos',
            merchant: 'Example Merchant',
            website: 'https://myapp.com'
        }
    }
};

const baseCancelPayload: CancelSubscriptionV2Request = {
    validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
    extensionAddress: ''
};

export function SubscriptionForm() {
    const [subscription, setSubscription] =
        useState<CreateSubscriptionV2Request>(baseSubscriptionPayload);
    const [subscriptionRes, setSubscriptionRes] = useState<CreateSubscriptionV2Response | null>(
        null
    );
    const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

    const [cancelPayload, setCancelPayload] =
        useState<CancelSubscriptionV2Request>(baseCancelPayload);
    const [cancelRes, setCancelRes] = useState<CancelSubscriptionV2Response | null>(null);
    const [cancelError, setCancelError] = useState<string | null>(null);

    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    const onSubscriptionChange = useCallback((value: object) => {
        setSubscription((value as { updated_src: typeof subscription }).updated_src);
    }, []);

    const onCancelChange = useCallback((value: object) => {
        setCancelPayload((value as { updated_src: typeof cancelPayload }).updated_src);
    }, []);

    // const loadTemplate = (template: CreateSubscriptionV2Request) => {
    //     setSubscription(template);
    // };

    const onSend = () => {
        setSubscriptionError(null);
        tonConnectUi
            .createSubscription(subscription, { version: 'v2' })
            .then(res => {
                setSubscriptionRes(res);
                setSubscriptionError(null);
                // Auto-fill extensionAddress in cancel form
                if (res.extensionAddress) {
                    setCancelPayload(prev => ({
                        ...prev,
                        extensionAddress: res.extensionAddress as string
                    }));
                }
            })
            .catch(err => {
                setSubscriptionError(err instanceof Error ? err.message : String(err));
                setSubscriptionRes(null);
            });
    };

    const onCancel = () => {
        if (!cancelPayload.extensionAddress) {
            setCancelError('No extensionAddress provided');
            return;
        }

        setCancelError(null);
        tonConnectUi
            .cancelSubscription(cancelPayload, { version: 'v2' })
            .then(res => {
                setCancelRes(res);
                setCancelError(null);
            })
            .catch(err => {
                setCancelError(err instanceof Error ? err.message : String(err));
                setCancelRes(null);
            });
    };

    return (
        <div className="create-subscription-form">
            <h3>Subscriptions</h3>

            {/* SUBSCRIBE BLOCK */}
            <div className="subscription-block">
                <h4 style={{ marginBottom: '10px' }}>Subscription Request Data</h4>

                <ReactJson
                    name={false}
                    src={subscription}
                    theme="ocean"
                    onEdit={onSubscriptionChange}
                    onAdd={onSubscriptionChange}
                    onDelete={onSubscriptionChange}
                />

                {subscriptionError && (
                    <>
                        <h4 style={{ color: 'red' }}>Error</h4>
                        <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
                            {subscriptionError}
                        </div>
                    </>
                )}

                {subscriptionRes && (
                    <>
                        <h4 style={{ color: 'green' }}>Create subscription response</h4>
                        <ReactJson name={false} src={subscriptionRes} theme="ocean" />
                        <div
                            style={{
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px'
                            }}
                        >
                            <strong>Parsed Extension Address from BOC:</strong>
                            <div
                                style={{
                                    fontFamily: 'monospace',
                                    marginTop: '5px',
                                    wordBreak: 'break-all'
                                }}
                            >
                                {parseExtensionAddressFromBoc(subscriptionRes.boc)}
                            </div>
                        </div>
                    </>
                )}

                {wallet && (
                    <div className="buttons-container">
                        <button onClick={onSend}>Create subscription</button>
                    </div>
                )}
            </div>

            {/* UNSUBSCRIBE BLOCK */}
            <div className="cancel-block">
                <h4 style={{ marginBottom: '10px' }}>Cancel Request Data</h4>

                <ReactJson
                    name={false}
                    src={cancelPayload}
                    theme="ocean"
                    onEdit={onCancelChange}
                    onAdd={onCancelChange}
                    onDelete={onCancelChange}
                />

                {cancelError && (
                    <>
                        <h4 style={{ color: 'red' }}>Error</h4>
                        <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
                            {cancelError}
                        </div>
                    </>
                )}

                {cancelRes && (
                    <>
                        <h4 style={{ color: 'green' }}>Cancel subscription response</h4>
                        <ReactJson name={false} src={cancelRes} theme="ocean" />
                    </>
                )}

                {wallet && (
                    <div className="buttons-container">
                        <button onClick={onCancel} disabled={!cancelPayload.extensionAddress}>
                            Cancel subscription
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
