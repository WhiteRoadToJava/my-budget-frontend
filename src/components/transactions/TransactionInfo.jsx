import React, { useState } from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/transactions/TransactionInfo.module.scss";
import Button from "../btns/Button";
import ToggleMenu from "../elements/ToggleMenu";
import UpdateTransfer from "../transfers/updateTransfer";
import UpdateIncomse from "../imcomses/UpdateIncomse";
import DeleteConfimation from "../modals/DeleteConfirmation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIncomse } from "../../api/incomseService";

const TransactionInfo = ({ isOpen, onClose, accounts, transaction }) => {
  const queryClient = useQueryClient();
  const [openUpdateTransfer, setOpenUpdateTransfer] = useState(false);
  const [openUpdateIncomse, setOpenUpdateIncomse] = useState(false);
  const [openDeleteIncomse, setOpenDeleteIncomse] = useState(false);
  const [openDeleteTransfer, setOpenDeleteTransfer] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });

  const deleteMutation = useMutation({
    mutationFn: (incomseId) =>  deleteIncomse(incomseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
      setOpenDeleteIncomse(false);
    },
    onError: () => {
      setError({
        hasError: true,
        message: "Failed to delete incomse. Please try again.",
      });
    },
  });

  const handleDeleteIncomse = async () => {
    const incomseId = transaction && transaction?.id;
    const data = deleteMutation.mutate(incomseId);
    console.log(data);
    if (data) {
      setOpenDeleteIncomse(false);
      onClose();
    }
  };

  const buttonMenuItems = [
    <Button
      key="edit"
      text="Edit"
      type="button"
      onClick={
        transaction.type === "in-transfer" ||
        transaction.type === "out-transfer"
          ? () => {
              setOpenUpdateTransfer(true);
            }
          : () => {
              setOpenUpdateIncomse(true);
            }
      }
    />,
    <Button
      key="delete"
      variant="cancel"
      text="Delete"
      type="button"
      onClick={() => setOpenDeleteIncomse(true)}
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
            <strong>Date:</strong>{" "}
            {new Date(transaction.createdAt).toLocaleDateString()}
          </p>
          <p className={styles.transactionDetail}>
            <strong>Description:</strong> {transaction.description}
          </p>

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
      ) : (
        <UpdateIncomse
          isOpen={openUpdateIncomse}
          isClose={() => {
            setOpenUpdateIncomse(false);
          }}
          incomse={transaction}
        />
      )}
      <DeleteConfimation
        isOpen={openDeleteIncomse}
        isClose={() => setOpenDeleteIncomse(false)}
        onDelete={handleDeleteIncomse}
      />
    </>
  );
};

export default TransactionInfo;
