import React from "react";

import styles from "../../styles/dashboard/dashboard.module.scss";
import Row from "../account/Row";
import sortingTransactions from "../../utils/sorting";

const ViewTransations = ({data = [], isError, error, isLoading }) => {

  const transactions = sortingTransactions(data);

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }
  if (isError) {
    return <div>Error loading accounts: {error.message}</div>;
  }
  console.log(transactions);
  return (
    <div className={styles.transactionContainer}>
      <h2>Transactions</h2>
      {transactions.slice(0, 10).map((transaction) => (
        <div key={transaction.id}>
          <Row key={transaction.id} transaction={transaction} />
        </div>
      ))}
    </div>
  );
};

export default ViewTransations;
