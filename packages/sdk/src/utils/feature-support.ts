import {
    Feature,
    SendTransactionFeature,
    SignDataFeature,
    MessageVariantType
} from '@tonconnect/protocol';
import { logWarning } from 'src/utils/log';
import { WalletNotSupportFeatureError } from 'src/errors/wallet';
import {
    RequiredFeatures,
    RequiredSendTransactionFeature,
    RequiredSignDataFeature
} from 'src/models';

export type MessageVariantsSupport = Readonly<{
    [K in MessageVariantType]: boolean;
}>;

export function checkSendTransactionSupport(
    features: Feature[],
    options: {
        requiredMessagesNumber: number;
        requireExtraCurrencies: boolean;
        requiredMessageVariants: RequiredSendTransactionFeature['messageVariants'];
    }
): never | void {
    const supportsDeprecatedSendTransactionFeature = features.includes('SendTransaction');
    const sendTransactionFeature = findFeature(features, 'SendTransaction');

    const requiredFeature: RequiredSendTransactionFeature = {
        minMessages: options.requiredMessagesNumber,
        extraCurrencyRequired: options.requireExtraCurrencies,
        messageVariants: options.requiredMessageVariants
    };

    const cause = {
        requiredFeature: { featureName: 'SendTransaction' as const, value: requiredFeature }
    };

    if (!supportsDeprecatedSendTransactionFeature && !sendTransactionFeature) {
        throw new WalletNotSupportFeatureError("Wallet doesn't support SendTransaction feature.", {
            cause
        });
    }

    const missingExtraCurrencies =
        options.requireExtraCurrencies && !sendTransactionFeature?.extraCurrencySupported;

    if (missingExtraCurrencies) {
        throw new WalletNotSupportFeatureError(
            `Wallet is not able to handle such SendTransaction request. Extra currencies support is required.`,
            { cause }
        );
    }

    const maxAvailableMessages = sendTransactionFeature?.maxMessages;
    if (maxAvailableMessages !== undefined) {
        if (maxAvailableMessages < options.requiredMessagesNumber) {
            throw new WalletNotSupportFeatureError(
                `Wallet is not able to handle such SendTransaction request. Max support messages number is ${maxAvailableMessages}, but ${options.requiredMessagesNumber} is required.`,
                { cause }
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
    const signDataFeature = features.find(
        feature => feature && typeof feature === 'object' && feature.name === 'SignData'
    ) as SignDataFeature;

    if (!signDataFeature) {
        throw new WalletNotSupportFeatureError("Wallet doesn't support SignData feature.", {
            cause: {
                requiredFeature: {
                    featureName: 'SignData',
                    value: { types: options.requiredTypes }
                }
            }
        });
    }

    const unsupportedTypes = options.requiredTypes.filter(
        requiredType => !signDataFeature.types.includes(requiredType)
    );

    if (unsupportedTypes.length) {
        throw new WalletNotSupportFeatureError(
            `Wallet doesn't support required SignData types: ${unsupportedTypes.join(', ')}.`,
            {
                cause: {
                    requiredFeature: { featureName: 'SignData', value: { types: unsupportedTypes } }
                }
            }
        );
    }
}

export function checkMessageVariantsSupport(
    features: Feature[],
    requestedVariants: RequiredSendTransactionFeature['messageVariants']
): MessageVariantsSupport {
    if (!requestedVariants) {
        return { gasless: false, battery: false, custodial: false };
    }

    const sendTransactionFeature = findFeature(features, 'SendTransaction');

    // If wallet doesn't support messageVariants at all, return all false
    if (!sendTransactionFeature?.messageVariants) {
        return { gasless: false, battery: false, custodial: false };
    }

    return {
        gasless: requestedVariants.gasless
            ? !!sendTransactionFeature.messageVariants.gasless
            : false,
        battery: requestedVariants.battery
            ? !!sendTransactionFeature.messageVariants.battery
            : false,
        custodial: requestedVariants.custodial
            ? !!sendTransactionFeature.messageVariants.custodial
            : false
    };
}

export function checkRequiredWalletFeatures(
    features: Feature[],
    walletsRequiredFeatures?: RequiredFeatures
): boolean {
    if (typeof walletsRequiredFeatures !== 'object') {
        return true;
    }

    const { sendTransaction, signData } = walletsRequiredFeatures;

    if (sendTransaction) {
        const feature = findFeature(features, 'SendTransaction');
        if (!feature) {
            return false;
        }

        if (!checkSendTransaction(feature, sendTransaction)) {
            return false;
        }
    }

    if (signData) {
        const feature = findFeature(features, 'SignData');
        if (!feature) {
            return false;
        }

        if (!checkSignData(feature, signData)) {
            return false;
        }
    }

    return true;
}

function findFeature<T extends Exclude<Feature, 'SendTransaction'>, P extends T['name']>(
    features: Feature[],
    requiredFeatureName: P
): (T & { name: P }) | undefined {
    return features.find(f => f && typeof f === 'object' && f.name === requiredFeatureName) as
        | (T & {
              name: P;
          })
        | undefined;
}

function checkSendTransaction(
    feature: SendTransactionFeature,
    requiredFeature: RequiredSendTransactionFeature
): boolean {
    const correctMessagesNumber =
        requiredFeature.minMessages === undefined ||
        requiredFeature.minMessages <= feature.maxMessages;

    const correctExtraCurrency =
        !requiredFeature.extraCurrencyRequired || feature.extraCurrencySupported;

    const correctMessageVariants =
        !requiredFeature.messageVariants ||
        (
            Object.keys(requiredFeature.messageVariants) as Array<
                keyof RequiredSendTransactionFeature['messageVariants']
            >
        ).every(v => !requiredFeature.messageVariants![v] || feature.messageVariants?.[v]);

    return !!(correctMessagesNumber && correctExtraCurrency && correctMessageVariants);
}

function checkSignData(
    feature: SignDataFeature,
    requiredFeature: RequiredSignDataFeature
): boolean {
    return requiredFeature.types.every(requiredType => feature.types.includes(requiredType));
}
