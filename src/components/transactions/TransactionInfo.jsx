import React, { useState } from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/transactions/TransactionInfo.module.scss";
import Button from "../btns/Button";
import ToggleMenu from "../elements/ToggleMenu";
import UpdateTransfer from "../transfers/UpdateTransfer";
import UpdateIncomse from "../imcomses/UpdateIncomse";
import UpdateExpense from "../expenses/UpdateExpense";
import DeleteConfimation from "../modals/DeleteConfirmation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncomse } from "../../api/incomseService";
import { deleteExpense } from "../../api/expenseService";
import { deleteTransfer } from "../../api/transferServce";

const TransactionInfo = ({ isOpen, onClose, accounts, transaction }) => {
  const queryClient = useQueryClient();
  const [openUpdateTransfer, setOpenUpdateTransfer] = useState(false);
  const [openUpdateIncomse, setOpenUpdateIncomse] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [updateExpense, setUpdateExpense] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });
  const accountName = transaction?.account?.name;

  const deleteMutation = useMutation({
    mutationFn: (incomseId) => deleteIncomse(incomseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
      setOpenConfirmDelete(false);
    },
    onError: () => {
      setError({
        hasError: true,
        message: "Failed to delete incomse. Please try again.",
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
    onError: () => {
      setError({
        hasError: true,
        message: "Failed to delete incomse. Please try again.",
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
        message: "Failed to delete transfer. Please try again.",
      });
    },
  });
  const handleUpdate = () => {
    const type = transaction && transaction?.type;
    switch (type) {
      case "incomse":
        setOpenUpdateIncomse(true);
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

  const buttonMenuItems = [
    <Button key="edit" text="Edit" type="button" onClick={handleUpdate} />,
    <Button
      key="delete"
      variant="cancel"
      text="Delete"
      type="button"
      onClick={() => setOpenConfirmDelete(true)}
    />,
    <Button
      key="close"
      variant="cancel"
      text="Close"
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
              {transaction.type} Details
            </h2>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.menuContainer}>
            <ToggleMenu menuList={buttonMenuItems} />
          </div>
          <p className={styles.transactionDetail}>
            <strong>Amount:</strong>{" "}
            {transaction?.amount
              ? Number(transaction.amount).toFixed(2)
              : "0.00"}{" "}
            {transaction.currency}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Account:</strong> {accountName}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Date:</strong>{" "}
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Description:</strong> {transaction.description}
          </p>
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button text="Close" variant="cancel" onClick={onClose} />
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
            setOpenUpdateIncomse(false);
            onClose(false);
          }}
          expense={transaction}
        />
      ) : (
        <UpdateIncomse
          isOpen={openUpdateIncomse}
          isClose={() => {
            setOpenUpdateIncomse(false);
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
