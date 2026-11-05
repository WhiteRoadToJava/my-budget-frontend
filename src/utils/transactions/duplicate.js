import {belongsToDebt} from "../transactionTypes";
import { feesFromTransfer } from "./transferFees";

const isTransferType = (type) => type === "in-transfer" || type === "out-transfer";

export const canDuplicate = (transaction) => {
    if  (!transaction || belongsToDebt(transaction)) return false;
    if (!["incomse", "expense", "in-transfer", "out-transfer"].includes(transaction.type)) return false;
    if(!transaction.sourceAccount?.id) return false;
    return!isTransferType(transaction.type) || !!transaction.destinationAccount?.id
};

export const incomeExpenseDraft = (transaction) => ({
    category: transaction.category ?? "",
    amount: String(Math.abs(Number(transaction.amount ?? 0))),
    description: transaction.description ?? "",
});

export const transferDraft = (transfer) => ({
    sourceAccount: {id: transfer.sourceAccount.id},
    destinationAccount: {id: transfer.destinationAccount.id},
    amountSent: transfer.amountSent ?? 0,
    exChangeRate: transfer.exChangeRate ?? 0,
    amountReceived: transfer.amountReceived ?? 0,
    description: transfer.description ?? "",
    fees: feesFromTransfer(transfer),
});