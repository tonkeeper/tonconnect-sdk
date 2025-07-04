import { createMemo, createSignal } from 'solid-js';
import { WalletInfoWithOpenMethod, WalletOpenMethod } from 'src/models/connected-wallet';
import { LastSelectedWalletInfoStorage } from 'src/storage';
import { ReturnStrategy } from 'src/models';
import { WalletsModalState } from 'src/models/wallets-modal';
import { SingleWalletModalState } from 'src/models/single-wallet-modal';

export type ActionName =
    | 'confirm-transaction'
    | 'transaction-sent'
    | 'transaction-canceled'
    | 'confirm-sign-data'
    | 'data-signed'
    | 'sign-data-canceled'
    | 'confirm-create-subscription'
    | 'confirm-cancel-subscription'
    | 'subscription-creation-initiated'
    | 'subscription-creation-canceled'
    | 'subscription-cancellation-initiated'
    | 'subscription-cancellation-canceled';

export type Action =
    | BasicAction
    | ConfirmTransactionAction
    | ConfirmSignDataAction
    | ConfirmCreateSubscriptionAction
    | ConfirmCancelSubscriptionAction;

type BasicAction = {
    name: ActionName;
    openModal: boolean;
    showNotification: boolean;
};

export type ConfirmTransactionAction = BasicAction & {
    name: 'confirm-transaction';
    returnStrategy: ReturnStrategy;
    twaReturnUrl: `${string}://${string}`;
    sent: boolean;
};

export type ConfirmSignDataAction = BasicAction & {
    name: 'confirm-sign-data';
    returnStrategy: ReturnStrategy;
    twaReturnUrl: `${string}://${string}`;
    signed: boolean;
};

export type ConfirmCreateSubscriptionAction = BasicAction & {
    name: 'confirm-create-subscription';
    returnStrategy: ReturnStrategy;
    twaReturnUrl: `${string}://${string}`;
    created: boolean;
};

export type ConfirmCancelSubscriptionAction = BasicAction & {
    name: 'confirm-cancel-subscription';
    returnStrategy: ReturnStrategy;
    twaReturnUrl: `${string}://${string}`;
    canceled: boolean;
};

export const [walletsModalState, setWalletsModalState] = createSignal<WalletsModalState>({
    status: 'closed',
    closeReason: null
});

export const getWalletsModalIsOpened = createMemo(() => walletsModalState().status === 'opened');

export const [singleWalletModalState, setSingleWalletModalState] =
    createSignal<SingleWalletModalState>({
        status: 'closed',
        closeReason: null
    });

export const getSingleWalletModalIsOpened = createMemo(
    () => singleWalletModalState().status === 'opened'
);

export const getSingleWalletModalWalletInfo = createMemo(() => {
    const state = singleWalletModalState();
    if (state.status === 'opened') {
        return state.walletInfo;
    }

    return null;
});

let lastSelectedWalletInfoStorage =
    typeof window !== 'undefined' ? new LastSelectedWalletInfoStorage() : undefined;
export const [lastSelectedWalletInfo, _setLastSelectedWalletInfo] = createSignal<
    | WalletInfoWithOpenMethod
    | {
          openMethod: WalletOpenMethod;
      }
    | null
>(lastSelectedWalletInfoStorage?.getLastSelectedWalletInfo() || null);

export const setLastSelectedWalletInfo = (
    walletInfo:
        | WalletInfoWithOpenMethod
        | {
              openMethod: WalletOpenMethod;
          }
        | null
): void => {
    if (!lastSelectedWalletInfoStorage) {
        lastSelectedWalletInfoStorage = new LastSelectedWalletInfoStorage();
    }

    if (walletInfo) {
        lastSelectedWalletInfoStorage.setLastSelectedWalletInfo(walletInfo);
    } else {
        lastSelectedWalletInfoStorage.removeLastSelectedWalletInfo();
    }
    _setLastSelectedWalletInfo(walletInfo);
};

export const [action, setAction] = createSignal<Action | null>(null);
