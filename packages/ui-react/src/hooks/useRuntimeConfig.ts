import { RuntimeConfig } from '@tonconnect/ui';
import { useTonWallet } from './useTonWallet';

/**
 * Use it to get the runtime config of the connected wallet.
 * Runtime config includes batteryExcessAddresses and other wallet-specific settings.
 * Hook will automatically update when the runtime config changes.
 * If wallet is not connected or runtime config is not available, hook will return null.
 *
 * @example
 * ```tsx
 * const runtimeConfig = useRuntimeConfig();
 * const batteryAddresses = runtimeConfig?.batteryExcessAddresses;
 * ```
 */
export function useRuntimeConfig(): RuntimeConfig | null {
    const wallet = useTonWallet();

    return wallet?.runtimeConfig || null;
}
