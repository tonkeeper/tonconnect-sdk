import { Component } from 'solid-js';
import { ActionModal } from 'src/app/views/modals/actions-modal/action-modal';
import { ErrorIcon } from 'src/app/components';

interface CreateSubscriptionCanceledModalProps {
    onClose: () => void;
}

export const CreateSubscriptionCanceledModal: Component<
    CreateSubscriptionCanceledModalProps
> = props => {
    return (
        <ActionModal
            headerTranslationKey="actionModal.createSubscriptionCanceled.header"
            textTranslationKey="actionModal.createSubscriptionCanceled.text"
            icon={<ErrorIcon size="m" />}
            onClose={() => props.onClose()}
            data-tc-sub-create-cancelled-modal="true"
        />
    );
};
