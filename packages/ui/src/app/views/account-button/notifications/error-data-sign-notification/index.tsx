import { Component } from 'solid-js';
import { Notification } from 'src/app/components/notification';
import { Styleable } from 'src/app/models/styleable';
import { ErrorIconStyled } from './style';

interface ErrorDataSignNotificationProps extends Styleable {}

export const ErrorDataSignNotification: Component<ErrorDataSignNotificationProps> = props => {
    return (
        <Notification
            header={{ translationKey: 'notifications.dataSignCanceled.header' }}
            icon={<ErrorIconStyled size="xs" />}
            class={props.class}
            data-tc-notification-tx-cancelled="true"
        >
            Data sign canceled
        </Notification>
    );
};
