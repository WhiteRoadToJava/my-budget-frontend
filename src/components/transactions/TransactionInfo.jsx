import React, { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DetailsSheet from "../details/DetailsSheet";
import detailsStyles from "../../styles/components/details/detailsSheet.module.scss";
import Button from "../btns/Button";
import UpdateTransfer from "../transfers/UpdateTransfer";
import UpdateIncome from "../incomes/UpdateIncome";
import UpdateExpense from "../expenses/UpdateExpense";
import DeleteConfimation from "../modals/DeleteConfirmation";
import { deleteIncomse } from "../../api/incomseService";
import { deleteExpense } from "../../api/expenseService";
import { deleteTransfer, getTransferById } from "../../api/transferServce";
import { getAccounts } from "../../api/accountService";
import {
  canDuplicate,
  incomeExpenseDraft,
  transferDraft,
} from "../../utils/transactions/duplicate.js";
import { findCategory } from "../../assiets/categories/assits";
import transferIcon from "../../assiets/categories/icons/currency.svg";
import {
  belongsToDebt,
  categoryName,
  typeLabelKey,
} from "../../utils/transactionTypes";
import {
  isIncoming,
  otherAccountName,
} from "../../utils/transactions/transactionList";
import { formatNumber } from "../../utils/formating";
import { dateFnsLocale } from "../../utils/dates";
import i18n from "../../configuration/i18n";
import CreateExpense from "../expenses/CreateExpense";
import CreateIncomse from "../incomes/CreateIncome";
import CreateTransfer from "../transfers/CreateTransfer";

const DELETE_ERROR_KEY = {
  incomse: "messages.errorDeleteIncomse",
  expense: "messages.errorDeleteExpenses",
  "in-transfer": "messages.errorDeleteTransfers",
  "out-transfer": "messages.errorDeleteTransfers",
  "transfer-fee-in": "messages.errorDeleteTransfers",
  "transfer-fee-out": "messages.errorDeleteTransfers",
};

const DELETE_FN = {
  incomse: deleteIncomse,
  expense: deleteExpense,
  "in-transfer": deleteTransfer,
  "out-transfer": deleteTransfer,
  // a fee row belongs to its transfer: deleting it deletes the transfer
  "transfer-fee-in": deleteTransfer,
  "transfer-fee-out": deleteTransfer,
};

// amounts, rate and fees of a transfer, each with the currency of its account
const money = (amount, account) =>
  `${formatNumber(Number(amount ?? 0))} ${account?.currency ?? ""}`.trim();

const feeText = (fee, direction, account) =>
  `${money(fee, account)} · ${i18n.t(direction === "CREDIT" ? "transferFees.credit" : "transferFees.charge")}` +
  ` · ${account?.name ?? i18n.t("account.accountdeleted")}`;

const transferBreakdown = (t) => {
  if (!t) return [];
  return [
    { label: i18n.t("transactionDetails.amountSent"), value: money(t.amountSent, t.sourceAccount) },
    Number(t.exChangeRate ?? 1) !== 1 && {
      label: i18n.t("transactionDetails.exchangeRate"), value: String(t.exChangeRate),
    },
    { label: i18n.t("transactionDetails.amountReceived"), value: money(t.amountReceived, t.destinationAccount) },
    t.sendFee > 0 && {
      label: i18n.t("transactionDetails.sendFee"),
      value: feeText(t.sendFee, t.sendFeeDirection, t.sendFeeAccount),
    },
    t.receiveFee > 0 && {
      label: i18n.t("transactionDetails.receiveFee"),
      value: feeText(t.receiveFee, t.receiveFeeDirection, t.receiveFeeAccount),
    },
  ].filter(Boolean);
};

const TransactionInfo = ({ isOpen, onClose, accounts, transaction }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const { data: accountsData } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const type = transaction?.type;
  const isFee = type === "transfer-fee-in" || type === "transfer-fee-out";
  // fee rows are part of a transfer: same edit, delete and details
  const isTransfer = type === "in-transfer" || type === "out-transfer" || isFee;
  // the full transfer (rate and fees are not in the list row)
  const { data: fullTransfer } = useQuery({
    queryKey: ["transfer", transaction?.id],
    queryFn: () => getTransferById(transaction.id),
    enabled: !!isOpen && isTransfer && !!transaction?.id,
  });
  const isDebtRecord = belongsToDebt(transaction);
  const incoming = isIncoming(transaction);
  const category = findCategory(transaction?.category, type);
  const typeKey = typeLabelKey(type);
  const currency = transaction?.sourceAccount?.currency ?? "";
  const date = new Date(transaction?.createdAt);
  const locale = dateFnsLocale(i18n.language);

  const close = () => {
    setError(null);
    onClose();
  };

  const deleteMutation = useMutation({
    mutationFn: () => DELETE_FN[type](transaction.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setConfirmDelete(false);
      close();
    },
    onError: (err) => {
      setConfirmDelete(false);
      // 409: the record was created by a debt movement and can only change from the debt page
      setError(
        i18n.t(
          err?.response?.status === 409
            ? "debts.errorDebtRecord"
            : DELETE_ERROR_KEY[type],
        ),
      );
    },
  });
  const startDuplicate = async () => {
    setError(null);
    if (!isTransfer) {
      setDuplicate({ type, data: incomeExpenseDraft(transaction) });
      return;
    }
    try {
      const transfer = await queryClient.fetchQuery({
        queryKey: ["transfer", transaction.id],
        queryFn: () => getTransferById(transaction.id),
      });
      setDuplicate({ type: "transfer", data: transferDraft(transfer) });
    } catch {
      setError(i18n.t("transactionDetails.errorDuplicate"));
    }
  };

  const endDuplicate = () => {
    setDuplicate(null);
    close();
  };

  const openDebt = () => {
    close();
    navigate(
      transaction?.debtId ? `/user/debts/${transaction.debtId}` : "/user/debts",
    );
  };

  const tone = isDebtRecord
    ? "debt"
    : isTransfer
      ? "transfer"
      : incoming
        ? "in"
        : "out";
  const title = isFee
    ? i18n.t("transactionsPage.transferFee", {
        from: transaction?.sourceAccount?.name || i18n.t("account.accountdeleted"),
        to: transaction?.destinationAccount?.name || i18n.t("account.accountdeleted"),
      })
    : isTransfer
    ? i18n.t(
        incoming
          ? "transactionsPage.fromAccount"
          : "transactionsPage.toAccount",
        {
          name:
            otherAccountName(transaction) || i18n.t("account.accountdeleted"),
        },
      )
    : categoryName(category) || (typeKey ? i18n.t(typeKey) : "");

  const fields = [
    !isTransfer && {
      label: i18n.t("transactionDetails.account"),
      value: transaction?.sourceAccount?.name,
    },
    isTransfer && {
      label: i18n.t("transactionDetails.sourceAccount"),
      value:
        transaction?.sourceAccount?.name || i18n.t("account.accountdeleted"),
    },
    isTransfer && {
      label: i18n.t("transactionDetails.destinationAccount"),
      value:
        transaction?.destinationAccount?.name ||
        i18n.t("account.accountdeleted"),
    },
    {
      label: i18n.t("transactionDetails.date"),
      value: Number.isNaN(date.getTime())
        ? null
        : format(date, "d MMMM yyyy", { locale }),
    },
    ...transferBreakdown(fullTransfer),
    {
      label: i18n.t("transactionDetails.description"),
      value: transaction?.description,
    },
  ].filter(Boolean);

  const actions = isDebtRecord
    ? [
        <Button
          key="open-debt"
          text={i18n.t("debts.openDebt")}
          type="button"
          onClick={openDebt}
        />,
      ]
    : [
        <Button
          key="delete"
          variant="delete-outlined"
          text={i18n.t("buttons.delete")}
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={deleteMutation.isPending}
        />,
        canDuplicate(transaction) && (
          <Button
            key="duplicate"
            variant="secondary"
            text={i18n.t("transactionDetails.duplicate")}
            type="button"
            onClick={startDuplicate}
          />
        ),
        <Button
          key="edit"
          variant="primary"
          text={i18n.t("buttons.edit")}
          type="button"
          onClick={() => setEditOpen(true)}
        />,
      ].filter(Boolean);

  const hasImage = transaction?.image?.url;

  return (
    <>
      <DetailsSheet
        isOpen={isOpen}
        onClose={close}
        tone={tone}
        icon={isTransfer ? transferIcon : category?.icon}
        kicker={typeKey ? i18n.t(typeKey) : ""}
        title={title}
        amount={`${incoming ? "+" : "−"}${formatNumber(Math.abs(Number(transaction?.amount ?? 0)))} ${currency}`}
        note={isDebtRecord ? i18n.t("debts.errorDebtRecord") : null}
        fields={fields}
        error={error}
        actions={actions}
      >
        {hasImage && (
          <button
            type="button"
            className={detailsStyles.image}
            onClick={() =>
              window.open(transaction.image.url, "_blank", "noopener")
            }
            aria-label={i18n.t("transactionDetails.openImage")}
          >
            <img src={transaction.image.url} alt="" />
          </button>
        )}
      </DetailsSheet>

      {isTransfer && (
        <UpdateTransfer
          isOpen={editOpen}
          isClose={() => {
            setEditOpen(false);
            close();
          }}
          accounts={accounts}
          transfer={transaction}
        />
      )}
      {type === "expense" && (
        <UpdateExpense
          isOpen={editOpen}
          isClose={() => {
            setEditOpen(false);
            close();
          }}
          expense={transaction}
        />
      )}
      {type === "incomse" && (
        <UpdateIncome
          isOpen={editOpen}
          isClose={() => {
            setEditOpen(false);
            close();
          }}
          incomse={transaction}
        />
      )}
      {duplicate?.type === "incomse" && (
        <CreateIncomse
          isOpen
          isClose={endDuplicate}
          account={transaction.sourceAccount}
          initialData={duplicate.data}
        />
      )}
      {duplicate?.type === "expense" && (
        <CreateExpense
          isOpen
          isClose={endDuplicate}
          account={transaction.sourceAccount}
          initialData={duplicate.data}
        />
      )}
      {duplicate?.type === "transfer" && (
        <CreateTransfer
          isOpen
          isClose={endDuplicate}
          accounts={accountsData}
          initialData={duplicate.data}
        />
      )}
      <DeleteConfimation
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onDelete={() => deleteMutation.mutate()}
      />
    </>
  );
};

export default TransactionInfo;
