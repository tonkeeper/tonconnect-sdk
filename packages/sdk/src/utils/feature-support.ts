import { Feature, SendTransactionFeature, SignDataFeature } from '@tonconnect/protocol';
import { logWarning } from 'src/utils/log';
import { WalletNotSupportFeatureError } from 'src/errors/wallet/wallet-not-support-feature.error';
import { RequireFeature } from 'src/models';

export function checkSendTransactionSupport(
    features: Feature[],
    options: { requiredMessagesNumber: number; requireExtraCurrencies: boolean }
): never | void {
    const supportsDeprecatedSendTransactionFeature = features.includes('SendTransaction');
    const sendTransactionFeature = features.find(
        feature => feature && typeof feature === 'object' && feature.name === 'SendTransaction'
    ) as SendTransactionFeature;

    if (!supportsDeprecatedSendTransactionFeature && !sendTransactionFeature) {
        throw new WalletNotSupportFeatureError("Wallet doesn't support SendTransaction feature.");
    }

    if (options.requireExtraCurrencies) {
        if (!sendTransactionFeature || !sendTransactionFeature.extraCurrencySupported) {
            throw new WalletNotSupportFeatureError(
                `Wallet is not able to handle such SendTransaction request. Extra currencies support is required.`
            );
        }
    }

    if (sendTransactionFeature && sendTransactionFeature.maxMessages !== undefined) {
        if (sendTransactionFeature.maxMessages < options.requiredMessagesNumber) {
            throw new WalletNotSupportFeatureError(
                `Wallet is not able to handle such SendTransaction request. Max support messages number is ${sendTransactionFeature.maxMessages}, but ${options.requiredMessagesNumber} is required.`
            );
        }
        return;
    }

    logWarning(
        "Connected wallet didn't provide information about max allowed messages in the SendTransaction request. Request may be rejected by the wallet."
    );
}

export function checkSignDataSupport(
    features: Feature[],
    options: { requiredTypes: SignDataFeature['types'] }
): never | void {
    return;
    const signDataFeature = features.find(
        feature => feature && typeof feature === 'object' && feature.name === 'SignData'
    ) as SignDataFeature;

    if (!signDataFeature) {
        throw new WalletNotSupportFeatureError("Wallet doesn't support SignData feature.");
    }

    const unsupportedTypes = options.requiredTypes.filter(
        requiredType => !signDataFeature.types.includes(requiredType)
    );

    if (unsupportedTypes.length) {
        throw new WalletNotSupportFeatureError(
            `Wallet doesn't support required SignData types: ${unsupportedTypes.join(', ')}.`
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
        const feature = features.find(
            f => typeof f === 'object' && f.name === requiredFeature.name
        );

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
