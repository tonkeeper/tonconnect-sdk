import { Component, For } from 'solid-js';
import { TransitionGroup } from 'solid-transition-group';
import { ConfirmOperationNotification } from './confirm-operation-notification';
import { ErrorTransactionNotification } from './error-transaction-notification';
import { SuccessTransactionNotification } from './success-transaction-notification';
import { NotificationClass } from './style';
import { Styleable } from 'src/app/models/styleable';
import { useOpenedNotifications } from 'src/app/hooks/use-notifications';
import { animate } from 'src/app/utils/animate';
import { ErrorSignDataNotification } from './error-sign-data-notification';
import { SuccessSignDataNotification } from './success-sign-data-notification';
import { SuccessCreateSubscriptionNotification } from './success-create-subscription-notification';
import { ErrorCreateSubscriptionNotification } from './error-create-subscription-notification';
import { SuccessCancelSubscriptionNotification } from './success-cancel-subscription-notification';
import { ErrorCancelSubscriptionNotification } from './error-cancel-subscription-notification';
import { ActionName } from 'src/app/state/modals-state';

// Map action strings to their corresponding notification components
const NotificationComponentMap: Record<ActionName, Component<{ class: string }>> = {
    // transaction
    'transaction-sent': SuccessTransactionNotification,
    'transaction-canceled': ErrorTransactionNotification,

    // sign‑data
    'data-signed': SuccessSignDataNotification,
    'sign-data-canceled': ErrorSignDataNotification,

    // subscription create
    'subscription-creation-initiated': SuccessCreateSubscriptionNotification,
    'subscription-creation-canceled': ErrorCreateSubscriptionNotification,

    // subscription cancel
    'subscription-cancellation-initiated': SuccessCancelSubscriptionNotification,
    'subscription-cancellation-canceled': ErrorCancelSubscriptionNotification,

    // confirm dialogs
    'confirm-transaction': ConfirmOperationNotification,
    'confirm-sign-data': ConfirmOperationNotification,
    'confirm-create-subscription': ConfirmOperationNotification,
    'confirm-cancel-subscription': ConfirmOperationNotification
};

export interface NotificationsProps extends Styleable {}

export const Notifications: Component<NotificationsProps> = props => {
    const openedNotifications = useOpenedNotifications();

    return (
        <div class={props.class} data-tc-list-notifications="true">
            <TransitionGroup
                onBeforeEnter={el => {
                    animate(
                        el,
                        [
                            { opacity: 0, transform: 'translateY(0)' },
                            { opacity: 1, transform: 'translateY(-8px)' }
                        ],
                        {
                            duration: 200
                        }
                    );
                }}
                onExit={(el, done) => {
                    const a = animate(
                        el,
                        [
                            { opacity: 1, transform: 'translateY(-8px)' },
                            { opacity: 0, transform: 'translateY(-30px)' }
                        ],
                        {
                            duration: 200
                        }
                    );
                    a.finished.then(done);
                }}
            >
                <For each={openedNotifications()}>
                    {openedNotification => {
                        const Notification = NotificationComponentMap[openedNotification.action];
                        if (!Notification) return null;

                        // Prefer a stable key (e.g. openedNotification.id) if available
                        return <Notification class={NotificationClass} />;
                    }}
                </For>
            </TransitionGroup>
        </div>
    );
};
