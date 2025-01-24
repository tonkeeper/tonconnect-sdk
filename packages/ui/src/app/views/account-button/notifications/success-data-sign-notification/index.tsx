import { Component } from 'solid-js';
import { Notification } from 'src/app/components/notification';
import { Styleable } from 'src/app/models/styleable';
import { SuccessIconStyled } from 'src/app/views/account-button/notifications/success-transaction-notification/style';

interface SuccessDataSignNotificationProps extends Styleable {}

export const SuccessDataSignNotification: Component<SuccessDataSignNotificationProps> = props => {
    return (
        <Notification
            header={{ translationKey: 'notifications.dataSigned.header' }}
            icon={<SuccessIconStyled />}
            class={props.class}
            data-tc-notification-tx-sent="true"
        >
            Data signed
        </Notification>
    );
};
