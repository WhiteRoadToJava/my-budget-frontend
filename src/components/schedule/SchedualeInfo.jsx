import React, { useState } from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/schedule/schedualeInfo.module.scss";
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

const SchedualeInfo = ({ isOpen, onClose, accounts, scheduale }) => {
  const queryClient = useQueryClient();
  const [openUpdateTransfer, setOpenUpdateTransfer] = useState(false);
  const [openUpdateIncomse, setOpenUpdateIncomse] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [updateExpense, setUpdateExpense] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });
  const accountName = scheduale?.sourceAccount?.name;

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
    const type = scheduale && scheduale?.type;
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
    const incomseId = scheduale && scheduale?.id;
    const type = scheduale && scheduale?.type;
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
      variant="delete"
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
          <div className={styles.transactionTitle} data-type={scheduale.transactionType}>
            <h2 className={styles.transactionTitleText}>Scheduale 
              {" " + scheduale.transactionType} Details
            </h2>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.menuContainer}>
            <ToggleMenu menuList={buttonMenuItems} />
          </div>

          <p className={styles.transactionDetail}>
            <strong>Name:</strong> {scheduale.name}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Category:</strong> {scheduale.category}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Amount:</strong>{" "}
            {scheduale?.amountSend
              ? Number(scheduale.amountSend).toFixed(2)
              : "0.00"}{" "}
            {scheduale.currency}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Account:</strong> {accountName}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Excutation Date:</strong>{" "}
            {new Date(scheduale.executionDate).toLocaleDateString()}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Description:</strong> {scheduale.description}
          </p>
          <div>
            {error.hasError && <p style={{ color: "red" }}>{error.message}</p>}
          </div>
          <div className={styles.buttonContainer}>
            <Button text="Close" variant="cancel" onClick={onClose} />
          </div>
        </div>
      </Modal>
      {scheduale &&
      (scheduale.type === "in-transfer" ||
        scheduale.type === "out-transfer") ? (
        <UpdateTransfer
          isOpen={openUpdateTransfer}
          isClose={() => {
            setOpenUpdateTransfer(false);
            onClose(false);
          }}
          accounts={accounts}
          transfer={scheduale}
        />
      ) : scheduale.type === "expense" ? (
        <UpdateExpense
          isOpen={updateExpense}
          isClose={() => {
            setOpenUpdateIncomse(false);
            onClose(false);
          }}
          expense={scheduale}
        />
      ) : (
        <UpdateIncomse
          isOpen={openUpdateIncomse}
          isClose={() => {
            setOpenUpdateIncomse(false);
            onClose(false);
          }}
          incomse={scheduale}
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

export default SchedualeInfo;
