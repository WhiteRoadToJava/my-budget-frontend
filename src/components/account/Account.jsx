import React, { useEffect, useState } from "react";
import styles from "../../styles/components/account/account.module.scss";
import Row from "./Row";
import { getAccounts, getAllAccountTransactions } from "../../api/accountService";
import Button from "../btns/Button";
import CreateIncomse from "../imcomses/CreateIncomse";
import CreateExpense from "../expenses/CreateExpense";
import ToogleMenu from "../elements/ToggleMenu";
import { useQuery } from "@tanstack/react-query";
import TransactionInfo from "../transactions/TransactionInfo";
import CreateTransfer from "../transfers/CreateTransfer";

const Account = ({ account }) => {
  const [isCreateIncomseOpen, setIsCreateIncomseOpen] = useState(false);
  const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isCreateTransfer, setIsCreateTransfer] = useState(false); 



  const {
    data: transactions = [],
    isLoading: isTxLoading,
    isError: isTxError,
    error: txError,
  } = useQuery({
    queryKey: ["transactions", account.id],
    queryFn: () => getAllAccountTransactions(account),
    select: (data) => [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
  const { 
    data: accounts = [], 
  } = useQuery({
    queryKey: ["accounts"], 
    queryFn: getAccounts, 
  });
  if (isTxLoading) return <div>Loading transactions...</div>;
  if (isTxError) {
    return <div>Error loading transactions: {txError.message}</div>;
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };







  const buttonMenuItems = [
    <Button
      key="inc"
      variant="primary"
      text="Create Income"
      onClick={() => setIsCreateIncomseOpen(true)}
    />,
    <Button
      key="exp"
      variant="cancel"
      text="Create Expense"
      onClick={() => setIsCreateExpenseOpen(true)}
    />,
    <Button
      key="tra"
      variant="blue"
      text="Create Transfer"
      onClick={() => setIsCreateTransfer(true)}
    />,
  ];

  // 6. العرض النهائي (JSX)
  return (
    <div className={styles.accountContainer}>
      <h2 className={styles.accountTitle}>{account.name}</h2>
      <div className={styles.divider}></div>
      <div className={styles.totalBalanceContainer}>
        Total Balance: <span className={styles.totalBalance}>{Number(account.totalBalance).toFixed(2)}</span>
      </div>
      
      <div className={styles.transactionsContainer}>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Row
              key={transaction.id}
              transaction={transaction}
              onClick={() => handleTransactionClick(transaction)}
            />
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <ToogleMenu menuList={buttonMenuItems} position="bottom" />
      </div>

      {/* Modals و Popups */}
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
      <TransactionInfo
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction || {}}
        currentAccount={account}
        accounts={accounts}
        transactions={transactions}
      />
      <CreateTransfer
        isOpen={isCreateTransfer}
        isClose={() => setIsCreateTransfer(false)}
        accounts={accounts}
        currentAccount={account}
      />
    </div>
  );
};

export default Account;