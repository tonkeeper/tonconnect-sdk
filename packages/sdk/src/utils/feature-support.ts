import { Feature, SendTransactionFeature } from '@tonconnect/protocol';
import { logWarning } from 'src/utils/log';
import { WalletNotSupportFeatureError } from 'src/errors/wallet/wallet-not-support-feature.error';
import { RequireFeature, SendTransactionRequest } from 'src/models';

export function checkSendTransactionSupport(
    features: Feature[],
    options: { transaction: SendTransactionRequest }
): never | void {
    const requiredMessagesNumber = options.transaction.messages.length;
    const extraCurrencyRequired = options.transaction.messages.some(
        message => message.extraCurrency && Object.keys(message.extraCurrency).length > 0
    );

    const supportsDeprecatedSendTransactionFeature = features.includes('SendTransaction');
    const sendTransactionFeature = features.find(
        feature => feature && typeof feature === 'object' && feature.name === 'SendTransaction'
    ) as SendTransactionFeature | undefined;

    if (!sendTransactionFeature) {
        if (!supportsDeprecatedSendTransactionFeature) {
            throw new WalletNotSupportFeatureError(
                "Wallet doesn't support SendTransaction feature."
            );
        }

        if (extraCurrencyRequired) {
            throw new WalletNotSupportFeatureError(
                "Connected wallet supports only the deprecated SendTransaction feature, which doesn't support extra currencies."
            );
        }

        logWarning(
            "Connected wallet supports only the deprecated SendTransaction feature and didn't provide information about max allowed messages. Requests may be rejected."
        );
        return;
    }

    if (extraCurrencyRequired && !sendTransactionFeature) {
        throw new WalletNotSupportFeatureError(
            `Wallet doesn't support extra currencies in SendTransaction requests.`
        );
    }

    if (sendTransactionFeature.maxMessages === undefined) {
        logWarning(
            "Connected wallet didn't provide information about max allowed messages in the SendTransaction request. Request may be rejected by the wallet."
        );
        return;
    }

    if (sendTransactionFeature.maxMessages < requiredMessagesNumber) {
        throw new WalletNotSupportFeatureError(
            `Wallet supports up to ${sendTransactionFeature.maxMessages} messages, but ${requiredMessagesNumber} were provided.`
        );
    }
}

export function checkRequiredWalletFeatures(
    features: Feature[],
    walletsRequiredFeatures: RequireFeature[] | ((features: Feature[]) => boolean)
): boolean {
    if (typeof walletsRequiredFeatures === 'function') {
        return walletsRequiredFeatures(features);
    }

    const res = walletsRequiredFeatures.every(requiredFeature => {
        const feature = features.find(f => typeof f === 'object' && f.name === requiredFeature.name);

        if (!feature) {
            return false;
        }

        switch (requiredFeature.name) {
            case 'SendTransaction': {
                const sendTransactionFeature = feature as SendTransactionFeature;
                const correctMessagesNumber =
                    requiredFeature.minMessages === undefined ||
                    requiredFeature.minMessages <= sendTransactionFeature.maxMessages;
                const correctExtraCurrency =
                    !requiredFeature.extraCurrencyRequired ||
                    sendTransactionFeature.extraCurrencySupported;

                return correctMessagesNumber && correctExtraCurrency;
            }
            case 'SignData':
                return true;
            default:
                return false;
        }
    });

    return res;
}
