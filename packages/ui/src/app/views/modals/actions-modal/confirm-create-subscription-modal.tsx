import { Component, useContext } from 'solid-js';
import { ActionModal } from 'src/app/views/modals/actions-modal/action-modal';
import { LoaderIcon } from 'src/app/components';
import { TonConnectUiContext } from 'src/app/state/ton-connect-ui.context';
import { useI18n } from '@solid-primitives/i18n';

interface ConfirmCreateSubscriptionModalProps {
    onClose: () => void;
}

export const ConfirmCreateSubscriptionModal: Component<
    ConfirmCreateSubscriptionModalProps
> = props => {
    const tonConnectUI = useContext(TonConnectUiContext);
    const [t] = useI18n();
    const name = (): string =>
        tonConnectUI!.wallet && 'name' in tonConnectUI!.wallet
            ? tonConnectUI!.wallet.name
            : t('common.yourWallet', {}, 'Your wallet');

    return (
        <ActionModal
            headerTranslationKey="actionModal.confirmCreateSubscription.header"
            headerTranslationValues={{ name: name() }}
            textTranslationKey="actionModal.confirmCreateSubscription.text"
            icon={<LoaderIcon size="m" />}
            onClose={() => props.onClose()}
            showButton="open-wallet"
            data-tc-sub-cancel-confirm-modal="true"
        />
    );
};
