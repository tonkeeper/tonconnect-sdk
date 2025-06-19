import { Component } from 'solid-js';
import { ActionModal } from 'src/app/views/modals/actions-modal/action-modal';
import { ErrorIcon } from 'src/app/components';

interface CancelSubscriptionCanceledModalProps {
    onClose: () => void;
}

export const CancelSubscriptionCanceledModal: Component<
    CancelSubscriptionCanceledModalProps
> = props => {
    return (
        <ActionModal
            headerTranslationKey="actionModal.cancelSubscriptionCanceled.header"
            textTranslationKey="actionModal.cancelSubscriptionCanceled.text"
            icon={<ErrorIcon size="m" />}
            onClose={() => props.onClose()}
            data-tc-sub-cancel-cancelled-modal="true"
        />
    );
};
