import { DeviceInfo } from '@tonconnect/protocol';
import { TonConnectError } from 'src/errors/ton-connect.error';

/**
 * Thrown when wallet can't get manifest by passed manifestUrl.
 */
export class WalletMissingRequiredFeaturesError extends TonConnectError<{
    device: DeviceInfo;
}> {
    declare cause: {
        device: DeviceInfo;
    };

    protected get info(): string {
        return 'Missing required features. You need to update your wallet.';
    }

    constructor(
        message: string,
        options: {
            cause: {
                device: DeviceInfo;
            };
        }
    ) {
        super(message, options);

        Object.setPrototypeOf(this, WalletMissingRequiredFeaturesError.prototype);
    }
}
