import React, { useState } from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/transactions/transactionInfo.module.scss";
import Button from "../btns/Button";
import ToggleMenu from "../elements/ToggleMenu";
import UpdateTransfer from "../transfers/UpdateTransfer";
import UpdateIncome from "../incomes/UpdateIncome";
import UpdateExpense from "../expenses/UpdateExpense";
import DeleteConfimation from "../modals/DeleteConfirmation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncomse } from "../../api/incomseService";
import { deleteExpense } from "../../api/expenseService";
import { deleteTransfer } from "../../api/transferServce";
import i18n from "../../configuration/i18n";
import { useNavigate } from "react-router-dom";
import { findCategory } from "../../assiets/categories/assits";
import { belongsToDebt, categoryName, typeLabelKey } from "../../utils/transactionTypes";

// 409: the record was created by a debt movement and can only change from the debt page
const deleteErrorMessage = (err, fallbackKey) =>
  i18n.t(err?.response?.status === 409 ? "debts.errorDebtRecord" : fallbackKey);

const TransactionInfo = ({ isOpen, onClose, accounts, transaction }) => {
  const queryClient = useQueryClient();
  const [openUpdateTransfer, setOpenUpdateTransfer] = useState(false);
  const [openUpdateIncome, setOpenUpdateIncome] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [updateExpense, setUpdateExpense] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });
  const sourceAccountName = transaction?.sourceAccount?.name;
  const destinationAccountName = transaction?.destinationAccount?.name;
  const navigate = useNavigate();
  const isDebtRecord = belongsToDebt(transaction);
  const category = findCategory(transaction?.category, transaction?.type);
  const typeKey = typeLabelKey(transaction?.type);

  const deleteMutation = useMutation({
    mutationFn: (incomseId) => deleteIncomse(incomseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
      setOpenConfirmDelete(false);
    },
    onError: (err) => {
      setOpenConfirmDelete(false);
      setError({
        hasError: true,
        message: deleteErrorMessage(err, "messages.errorDeleteIncomse"),
      });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId) => deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
      setOpenConfirmDelete(false);
    },
    onError: (err) => {
      setOpenConfirmDelete(false);
      setError({
        hasError: true,
        message: deleteErrorMessage(err, "messages.errorDeleteExpenses"),
      });
    },
  });
  const deleteTransferMutation = useMutation({
    mutationFn: (transferId) => deleteTransfer(transferId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
      setOpenConfirmDelete(false);
    },
    onError: () => {
      setError({
        hasError: true,
        message: i18n.t("messages.errorDeleteTransfers"),
      });
    },
  });
  const handleUpdate = () => {
    const type = transaction && transaction?.type;
    switch (type) {
      case "incomse":
        setOpenUpdateIncome(true);
        break;
      case "expense":
        setUpdateExpense(true);
        break;
      case "in-transfer":
        setOpenUpdateTransfer(true);
        break;
      case "out-transfer":
        setOpenUpdateTransfer(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    const incomseId = transaction && transaction?.id;
    const type = transaction && transaction?.type;
    switch (type) {
      case "incomse":
        deleteMutation.mutate(incomseId);
        break;
      case "expense":
        deleteExpenseMutation.mutate(incomseId);
        break;
      case "in-transfer":
        deleteTransferMutation.mutate(incomseId);
        break;
      case "out-transfer":
        deleteTransferMutation.mutate(incomseId);
        break;
      default:
        break;
    }
  };

  // debt records are changed from the debt page: offer a way there instead of edit/delete
  const openDebt = () => {
    onClose();
    navigate(transaction?.debtId ? `/user/debts/${transaction.debtId}` : "/user/debts");
  };

  const debtMenuItems = [
    <Button key="open-debt" text={i18n.t("debts.openDebt")} type="button" onClick={openDebt} />,
    <Button
      key="close"
      variant="cancel"
      text={i18n.t("buttons.close")}
      type="button"
      onClick={onClose}
    />,
  ];

  const buttonMenuItems = [
    <Button
      key="edit"
      text={i18n.t("buttons.edit", {
        defaultMessage: "Edit",
      })}
      type="button"
      onClick={handleUpdate}
    />,
    <Button
      key="delete"
      variant="delete"
      text={i18n.t("buttons.delete", {
        defaultMessage: "Delete",
      })}
      type="button"
      onClick={() => setOpenConfirmDelete(true)}
    />,
    <Button
      key="close"
      variant="cancel"
      text={i18n.t("buttons.close", {
        defaultMessage: "Close",
      })}
      type="button"
      onClick={onClose}
    />,
  ];
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className={styles.transactionContainer}>
          <div className={styles.transactionTitle} data-type={transaction.type}>
            <h2 className={styles.transactionTitleText}>
              {i18n.t("transactionDetails.transaction")}{" "}
              {typeKey ? i18n.t(typeKey) : ""}{" "}
              {i18n.t("transactionDetails.details")}
            </h2>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.menuContainer}>
            <ToggleMenu menuList={isDebtRecord ? debtMenuItems : buttonMenuItems} />
          </div>
          {isDebtRecord && (
            <p className={styles.transactionDetail} role="note">
              {i18n.t("debts.errorDebtRecord")}
            </p>
          )}
          {category && (
            <p className={styles.transactionDetail}>
              <strong>{i18n.t("transactionDetails.category")}:</strong> {categoryName(category)}
            </p>
          )}
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("transactionDetails.amount")}:</strong>{" "}
            {transaction?.amount
              ? Number(transaction.amount).toFixed(2)
              : "0.00"}{" "}
            {transaction.currency}
          </p>

          {transaction.type === "in-transfer" ||
          transaction.type === "out-transfer" ? (
            <>
              <p className={styles.transactionDetail}>
                <strong>{i18n.t("transactionDetails.sourceAccount")}:</strong>{" "}
                {sourceAccountName}
              </p>
              <p className={styles.transactionDetail}>
                <strong>
                  {i18n.t("transactionDetails.destinationAccount")}:
                </strong>{" "}
                {destinationAccountName}
              </p>
            </>
          ) : (
            <p className={styles.transactionDetail}>
              <strong>{i18n.t("transactionDetails.account")}:</strong>{" "}
              {sourceAccountName}
            </p>
          )}
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("transactionDetails.date")}:</strong>{" "}
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
          <p className={styles.transactionDetail}>
            <strong>{i18n.t("transactionDetails.description")}:</strong>{" "}
            {transaction.description}
          </p>
          {transaction.image && transaction.image.url !==""&& (
            <div className={styles.transactionImageContainer}>
              <img
                src={transaction.image.url}
                alt={transaction.image.filename}
                className={styles.transactionImage}
                onClick={() =>
                  window.open(transaction.image.url, "_blank")
                }
              />
            </div>
          )}
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          

          <div className={styles.buttonContainer}>
            <Button
              text={i18n.t("buttons.close")}
              variant="cancel"
              onClick={onClose}
            />
          </div>
        </div>
      </Modal>
      {transaction &&
      (transaction.type === "in-transfer" ||
        transaction.type === "out-transfer") ? (
        <UpdateTransfer
          isOpen={openUpdateTransfer}
          isClose={() => {
            setOpenUpdateTransfer(false);
            onClose(false);
          }}
          accounts={accounts}
          transfer={transaction}
        />
      ) : transaction.type === "expense" ? (
        <UpdateExpense
          isOpen={updateExpense}
          isClose={() => {
            setUpdateExpense(false);
            onClose(false);
          }}
          expense={transaction}
        />
      ) : (
        <UpdateIncome
          isOpen={openUpdateIncome}
          isClose={() => {
            setOpenUpdateIncome(false);
            onClose(false);
          }}
          incomse={transaction}
        />
      )}
      <DeleteConfimation
        isOpen={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default TransactionInfo;
