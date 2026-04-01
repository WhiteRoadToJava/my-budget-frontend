import React from "react";
import Modal from "../modals/Modal";
import styles from "../../styles/components/transactions/TransactionInfo.module.scss";
import Button from "../btns/Button";

const TransactionInfo = ({ isOpen, onClose, transaction }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.transactionContainer}>
        <div className={styles.transactionTitle} data-type={transaction.type}>
          <h2 className={styles.transactionTitleText} >{transaction.type} Details</h2>
        </div>

        <div className={styles.divider}></div>
        <p className={styles.transactionDetail}>
          <strong>Amount:</strong> {transaction.amount}
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
