import React from "react";
import { getAllIncomseAndExpensesTransactions } from "../../api/accountService";
import { useQuery } from "@tanstack/react-query";
import styles from "../../styles/dashboard/dashboard.module.scss";
import Row from "../account/Row";
import sortingTransactions from "../../utils/sorting";

const ViewTransations = () => {
  const {
    data: data = [],
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    error: accountsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getAllIncomseAndExpensesTransactions(),
    select: (data) =>
      [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
  const transactions = sortingTransactions(data);
  console.log(transactions);

  if (isAccountsLoading) {
    return <div>Loading accounts...</div>;
  }
  if (isAccountsError) {
    return <div>Error loading accounts: {accountsError.message}</div>;
  }
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
