import { Component } from 'solid-js';
import { Notification } from 'src/app/components/notification';
import { Styleable } from 'src/app/models/styleable';
import { SuccessIconStyled } from './style';

interface SuccessCancelSubscriptionNotificationProps extends Styleable {}

export const SuccessCancelSubscriptionNotification: Component<
    SuccessCancelSubscriptionNotificationProps
> = props => {
    return (
        <Notification
            header={{ translationKey: 'notifications.cancelSubscriptionInitiated.header' }}
            text={{ translationKey: 'notifications.cancelSubscriptionInitiated.text' }}
            icon={<SuccessIconStyled />}
            class={props.class}
            data-tc-notification-sub-cancel-init="true"
        >
            Cancel Subscription initiated
        </Notification>
    );
};
