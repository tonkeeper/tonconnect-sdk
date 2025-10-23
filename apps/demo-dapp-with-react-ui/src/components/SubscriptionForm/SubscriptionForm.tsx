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

export function SubscriptionForm() {
    const [subscription, setSubscription] =
        useState<CreateSubscriptionV2Request>(baseSubscriptionPayload);
    const [subscriptionRes, setSubscriptionRes] = useState<CreateSubscriptionV2Response | null>(
        null
    );
    const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
    const [cancelRes, setCancelRes] = useState<CancelSubscriptionV2Response | null>(null);
    const [cancelError, setCancelError] = useState<string | null>(null);

    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    const onChange = useCallback((value: object) => {
        setSubscription((value as { updated_src: typeof subscription }).updated_src);
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
            })
            .catch(err => {
                setSubscriptionError(err instanceof Error ? err.message : String(err));
                setSubscriptionRes(null);
            });
    };

    const onCancel = () => {
        if (!subscriptionRes?.boc) {
            console.error('No subscription response boc available');
            return;
        }

        const cancelRequest: CancelSubscriptionV2Request = {
            validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
            extensionAddress: subscriptionRes.boc,
            network: subscription.network,
            from: subscription.from
        };

        setCancelError(null);
        tonConnectUi
            .cancelSubscription(cancelRequest, { version: 'v2' })
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
            <h3>Configure and create subsciption</h3>
            <h4>Subscription data </h4>

            {/* <div className="template-buttons">
                <button onClick={() => loadTemplate(defaultTextData)}>
                    Text
                </button>
                <button onClick={() => loadTemplate(defaultBinaryData)}>
                    Binary
                </button>
                <button onClick={() => loadTemplate(defaultCellData)}>
                    Cell
                </button>
            </div> */}
            <ReactJson
                name={false}
                src={subscription}
                theme="ocean"
                onEdit={onChange}
                onAdd={onChange}
                onDelete={onChange}
            />
            {subscriptionError && (
                <>
                    <h4 style={{ color: 'red' }}>Create subscription error</h4>
                    <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
                        {subscriptionError}
                    </div>
                </>
            )}
            {subscriptionRes && (
                <>
                    <h4 style={{ color: 'green' }}>Create subscription response</h4>
                    <ReactJson name={false} src={subscriptionRes} theme="ocean" />
                </>
            )}
            {cancelError && (
                <>
                    <h4 style={{ color: 'red' }}>Cancel subscription error</h4>
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
                    <button onClick={onSend}>Create subscription</button>
                    {subscriptionRes && (
                        <button onClick={onCancel} disabled={!subscriptionRes?.boc}>
                            Cancel subscription
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
