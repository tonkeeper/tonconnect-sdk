import { SendTransactionRequest } from 'src/models';

export interface SendTransactionResponse {
    /**
     * Signed boc
     */
    boc: string;
    /**
     * Type of transaction
     */
    type?: keyof NonNullable<SendTransactionRequest['messagesVariants']>;
}
