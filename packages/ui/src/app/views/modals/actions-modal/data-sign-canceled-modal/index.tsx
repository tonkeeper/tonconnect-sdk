import { Component } from 'solid-js';
import { ActionModal } from 'src/app/views/modals/actions-modal/action-modal';
import { ErrorIcon } from 'src/app/components';

interface DataSignCanceledModalProps {
    onClose: () => void;
}

export const DataSignCanceledModal: Component<DataSignCanceledModalProps> = props => {
    return (
        <ActionModal
            headerTranslationKey="actionModal.dataSignCanceled.header"
            icon={<ErrorIcon size="m" />}
            onClose={() => props.onClose()}
            data-tc-data-sign-canceled-modal="true"
        />
    );
};
