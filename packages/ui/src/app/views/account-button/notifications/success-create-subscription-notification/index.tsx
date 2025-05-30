import { Component } from 'solid-js';
import { Notification } from 'src/app/components/notification';
import { Styleable } from 'src/app/models/styleable';
import { SuccessIconStyled } from './style';

interface SuccessCreateSubscriptionNotificationProps extends Styleable {}

export const SuccessCreateSubscriptionNotification: Component<
    SuccessCreateSubscriptionNotificationProps
> = props => {
    return (
        <Notification
            header={{ translationKey: 'notifications.createSubscriptionInitiated.header' }}
            text={{ translationKey: 'notifications.createSubscriptionInitiated.text' }}
            icon={<SuccessIconStyled />}
            class={props.class}
            data-tc-notification-sub-create-init="true"
        >
            Create Subscription initiated
        </Notification>
    );
};
