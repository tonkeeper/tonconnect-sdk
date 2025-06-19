import { Component } from 'solid-js';
import { Notification } from 'src/app/components/notification';
import { Styleable } from 'src/app/models/styleable';
import { ErrorIconStyled } from './style';

interface ErrorCancelSubscriptionNotificationProps extends Styleable {}

export const ErrorCancelSubscriptionNotification: Component<
    ErrorCancelSubscriptionNotificationProps
> = props => {
    return (
        <Notification
            header={{ translationKey: 'notifications.cancelSubscriptionCanceled.header' }}
            text={{ translationKey: 'notifications.cancelSubscriptionCanceled.text' }}
            icon={<ErrorIconStyled size="xs" />}
            class={props.class}
            data-tc-notification-sub-cancel-cancelled="true"
        >
            Cancel Subscription cancelled
        </Notification>
    );
};
