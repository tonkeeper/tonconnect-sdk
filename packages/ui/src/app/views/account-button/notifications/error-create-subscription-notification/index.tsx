import { Component } from 'solid-js';
import { Notification } from 'src/app/components/notification';
import { Styleable } from 'src/app/models/styleable';
import { ErrorIconStyled } from './style';

interface ErrorCreateSubscriptionNotificationProps extends Styleable {}

export const ErrorCreateSubscriptionNotification: Component<
    ErrorCreateSubscriptionNotificationProps
> = props => {
    return (
        <Notification
            header={{ translationKey: 'notifications.createSubscriptionCanceled.header' }}
            text={{ translationKey: 'notifications.createSubscriptionCanceled.text' }}
            icon={<ErrorIconStyled size="xs" />}
            class={props.class}
            data-tc-notification-sub-create-cancelled="true"
        >
            Create Subscription cancelled
        </Notification>
    );
};
