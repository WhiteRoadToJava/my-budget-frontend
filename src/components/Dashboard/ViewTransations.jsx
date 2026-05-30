import React from "react";
import i18n from "../../configuration/i18n";
import styles from "../../styles/dashboard/dashboard.module.scss";
import Row from "../account/Row";
import sortingTransactions from "../../utils/sorting";

const ViewTransations = ({data = [], isError, error, isLoading }) => {

  const transactions = sortingTransactions(data);

  if (isLoading) {
    return <div>{i18n.t("messages.loading")}</div>;
  }
  if (isError) {
    return <div>{i18n.t("messages.errorLoading")} {error.message}</div>;
  }
  return (
    <div className={styles.transactionContainer}>
      <h2>{i18n.t("viewTransations.title")}</h2>
      {transactions.slice(0, 10).map((transaction) => (
        <div key={transaction.id}>
          <Row key={transaction.id} transaction={transaction} />
        </div>
      ))}
    </div>
  );
};

export default ViewTransations;
