import { Component } from 'solid-js';
import { ActionModal } from 'src/app/views/modals/actions-modal/action-modal';
import { SuccessIcon } from 'src/app/components';

interface CancelSubscriptionInitiatedModalProps {
    onClose: () => void;
}

export const CancelSubscriptionInitiatedModal: Component<
    CancelSubscriptionInitiatedModalProps
> = props => {
    return (
        <ActionModal
            headerTranslationKey="actionModal.cancelSubscriptionInitiated.header"
            textTranslationKey="actionModal.cancelSubscriptionInitiated.text"
            icon={<SuccessIcon size="m" />}
            onClose={() => props.onClose()}
            data-tc-sub-cancel-init-modal="true"
        />
    );
};
