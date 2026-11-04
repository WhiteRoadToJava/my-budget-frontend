import React, { useState } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { deleteTransfer } from "../../api/transferServce";
import { findCategory } from "../../assiets/categories/assits";
import transferIcon from "../../assiets/categories/icons/currency.svg";
import { belongsToDebt, categoryName, typeLabelKey } from "../../utils/transactionTypes";
import { isIncoming, otherAccountName } from "../../utils/transactions/transactionList";
import { formatNumber } from "../../utils/formating";
import { dateFnsLocale } from "../../utils/dates";
import i18n from "../../configuration/i18n";

const DELETE_ERROR_KEY = {
  incomse: "messages.errorDeleteIncomse",
  expense: "messages.errorDeleteExpenses",
  "in-transfer": "messages.errorDeleteTransfers",
  "out-transfer": "messages.errorDeleteTransfers",
};

const DELETE_FN = {
  incomse: deleteIncomse,
  expense: deleteExpense,
  "in-transfer": deleteTransfer,
  "out-transfer": deleteTransfer,
};

const TransactionInfo = ({ isOpen, onClose, accounts, transaction }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);

  const type = transaction?.type;
  const isTransfer = type === "in-transfer" || type === "out-transfer";
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
      setError(i18n.t(err?.response?.status === 409 ? "debts.errorDebtRecord" : DELETE_ERROR_KEY[type]));
    },
  });

  const openDebt = () => {
    close();
    navigate(transaction?.debtId ? `/user/debts/${transaction.debtId}` : "/user/debts");
  };

  const tone = isDebtRecord ? "debt" : isTransfer ? "transfer" : incoming ? "in" : "out";
  const title = isTransfer
    ? i18n.t(incoming ? "transactionsPage.fromAccount" : "transactionsPage.toAccount", {
        name: otherAccountName(transaction) || i18n.t("account.accountdeleted"),
      })
    : categoryName(category) || (typeKey ? i18n.t(typeKey) : "");

  const fields = [
    !isTransfer && { label: i18n.t("transactionDetails.account"), value: transaction?.sourceAccount?.name },
    isTransfer && { label: i18n.t("transactionDetails.sourceAccount"),
      value: transaction?.sourceAccount?.name || i18n.t("account.accountdeleted") },
    isTransfer && { label: i18n.t("transactionDetails.destinationAccount"),
      value: transaction?.destinationAccount?.name || i18n.t("account.accountdeleted") },
    {
      label: i18n.t("transactionDetails.date"),
      value: Number.isNaN(date.getTime()) ? null : format(date, "d MMMM yyyy", { locale }),
    },
    { label: i18n.t("transactionDetails.description"), value: transaction?.description },
  ].filter(Boolean);

  const actions = isDebtRecord
    ? [<Button key="open-debt" text={i18n.t("debts.openDebt")} type="button" onClick={openDebt} />]
    : [
        <Button key="delete" variant="delete-outlined" text={i18n.t("buttons.delete")} type="button"
          onClick={() => setConfirmDelete(true)} disabled={deleteMutation.isPending} />,
        <Button key="edit" variant="primary" text={i18n.t("buttons.edit")} type="button"
          onClick={() => setEditOpen(true)} />,
      ];

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
          <button type="button" className={detailsStyles.image}
            onClick={() => window.open(transaction.image.url, "_blank", "noopener")}
            aria-label={i18n.t("transactionDetails.openImage")}>
            <img src={transaction.image.url} alt="" />
          </button>
        )}
      </DetailsSheet>

      {isTransfer && (
        <UpdateTransfer isOpen={editOpen} isClose={() => { setEditOpen(false); close(); }}
          accounts={accounts} transfer={transaction} />
      )}
      {type === "expense" && (
        <UpdateExpense isOpen={editOpen} isClose={() => { setEditOpen(false); close(); }}
          expense={transaction} />
      )}
      {type === "incomse" && (
        <UpdateIncome isOpen={editOpen} isClose={() => { setEditOpen(false); close(); }}
          incomse={transaction} />
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
