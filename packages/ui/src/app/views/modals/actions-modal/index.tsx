import { Component, Show, createMemo } from 'solid-js';
import { Modal } from 'src/app/components';
import { appState } from 'src/app/state/app.state';
import { action, setAction } from 'src/app/state/modals-state';
import { ConfirmTransactionModal } from 'src/app/views/modals/actions-modal/confirm-transaction-modal';
import { TransactionCanceledModal } from 'src/app/views/modals/actions-modal/transaction-canceled-modal';
import { TransactionSentModal } from 'src/app/views/modals/actions-modal/transaction-sent-modal';
import { ConfirmSignDataModal } from './confirm-sign-data-modal';
import { SignDataCanceledModal } from './sign-data-canceled-modal';
import { DataSignedModal } from './data-signed-modal';
import { CreateSubscriptionInitiatedModal } from './subscription-creation-initiated-modal';
import { ConfirmCreateSubscriptionModal } from './confirm-create-subscription-modal';
import { CancelSubscriptionInitiatedModal } from './subscription-cancellation-initiated-modal';
import { CreateSubscriptionCanceledModal } from './subscription-creation-canceled-modal';
import { CancelSubscriptionCanceledModal } from './subscription-cancellation-canceled-modal';
import { ConfirmCancelSubscriptionModal } from './confirm-cancel-subscription-modal';

// Map action names to their corresponding modal components
const ActionModalComponentMap: Record<string, Component<{ onClose: () => void }>> = {
    // transaction
    'transaction-sent': TransactionSentModal,
    'transaction-canceled': TransactionCanceledModal,
    'confirm-transaction': ConfirmTransactionModal,

    // sign data
    'data-signed': DataSignedModal,
    'sign-data-canceled': SignDataCanceledModal,
    'confirm-sign-data': ConfirmSignDataModal,

    // subscription create
    'subscription-creation-initiated': CreateSubscriptionInitiatedModal,
    'subscription-creation-canceled': CreateSubscriptionCanceledModal,
    'confirm-create-subscription': ConfirmCreateSubscriptionModal,

    // subscription cancel
    'subscription-cancellation-initiated': CancelSubscriptionInitiatedModal,
    'subscription-cancellation-canceled': CancelSubscriptionCanceledModal,
    'confirm-cancel-subscription': ConfirmCancelSubscriptionModal
};

export const ActionsModal: Component = () => {
    // Derive the component to render based on the current action
    const modalComponent = createMemo(() => {
        const current = action();
        return current ? ActionModalComponentMap[current.name] : null;
    });

    return (
        <Modal
            opened={action() !== null && action()?.openModal === true}
            enableAndroidBackHandler={appState.enableAndroidBackHandler}
            onClose={() => setAction(null)}
            showFooter={false}
            data-tc-actions-modal-container="true"
        >
            <Show when={modalComponent()} keyed>
                {ModalComponent => <ModalComponent onClose={() => setAction(null)} />}
            </Show>
        </Modal>
    );
};
