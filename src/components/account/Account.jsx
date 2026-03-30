import React, { useEffect, useState } from "react";
import styles from "../../styles/components/account/account.module.scss";
import Row from "./Row";
import { getAllTransactions } from "../../api/accountService";
import Button from "../btns/Button";
import CreateIncomse from "../imcomses/CreateIncomse";
import CreateExpense from "../expenses/CreateExpense";

import { useQuery } from "@tanstack/react-query"

const Account = ({ account }) => {
  const [isCreateIncomseOpen, setIsCreateIncomseOpen] = useState(false);
  const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false);

  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactions", account.id],
    queryFn: () => getAllTransactions(account),
  }); 

  if (isLoading) return <div>Loading transactions...</div>;
  if (isError) {
    return <div>Error loading transactions: {error.message}</div>;
  }
  console.log(transactions);
  return (
    <div className={styles.accountContainer}>
      <h2 className={styles.accountTitle}>{account.name}</h2>
      <div className={styles.divider}></div>
      <div className={styles.totalBalanceContainer}>Total Balance:</div>
      <div className={styles.totalBalance}>{account.totalBalance}</div>
      <div className={styles.transactionsContainer}>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Row key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="primary"
          text="Create Incomse"
          onClick={() => setIsCreateIncomseOpen(true)}
        />
        <Button
          variant="cancel"
          text="Create Expense"
          onClick={() => setIsCreateExpenseOpen(true)}
        />
        <Button
          variant="blue"
          text="Create Transfer"
          onClick={() => setIsCreateIncomseOpen(false)}
        />
      </div>
      <div>
        <CreateIncomse
          isOpen={isCreateIncomseOpen}
          isClose={() => setIsCreateIncomseOpen(false)}
          account={account}
        />
        <CreateExpense
          isOpen={isCreateExpenseOpen}
          isClose={() => setIsCreateExpenseOpen(false)}
          account={account}
        />
      </div>
    </div>
  );
};

export default Account;
