import React from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/transactions/TransactionInfo.module.scss";
import Button from "../btns/Button";
import ToggleMenu from "../elements/ToggleMenu";

const TransactionInfo = ({ isOpen, onClose, transaction }) => {
  const buttonMenuItems = [
    <Button
      key="edit"
      text="Edit"
      type="button"
      onClick={() => console.log("Edit account")}
    />,
    <Button
      key="delete"
      variant="cancel"
      text="Delete"
      type="button"
      onClick={() => console.log("Delete account")}
    />,
  ];
  return (
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
          <strong>Amount:</strong> {transaction?.amount ? Number(transaction.amount).toFixed(2) : "0.00"} {transaction.currency}
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
  );
};

export default TransactionInfo;
