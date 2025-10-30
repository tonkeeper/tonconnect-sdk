import { Component } from 'solid-js';
import { ActionModal } from 'src/app/views/modals/actions-modal/action-modal';
import { SuccessIcon } from 'src/app/components';

interface CreateSubscriptionInitiatedModalProps {
    onClose: () => void;
}

export const CreateSubscriptionInitiatedModal: Component<
    CreateSubscriptionInitiatedModalProps
> = props => {
    return (
        <ActionModal
            headerTranslationKey="actionModal.createSubscriptionInitiated.header"
            textTranslationKey="actionModal.createSubscriptionInitiated.text"
            icon={<SuccessIcon size="m" />}
            onClose={() => props.onClose()}
            data-tc-sub-create-init-modal="true"
        />
    );
};
