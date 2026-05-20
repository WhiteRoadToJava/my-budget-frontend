import React, { useEffect, useState } from "react";
import styles from "../../styles/components/account/account.module.scss";
import Row from "./Row";
import {
  getAccounts,
  getAllAccountTransactions,
} from "../../api/accountService";
import Button from "../btns/Button";
import CreateIncomse from "../imcomses/CreateIncomse";
import CreateExpense from "../expenses/CreateExpense";
import ToogleMenu from "../elements/ToggleMenu";
import { useQuery } from "@tanstack/react-query";
import TransactionInfo from "../transactions/TransactionInfo";
import CreateTransfer from "../transfers/CreateTransfer";
import i18n from "../../configuration/i18n";

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
    select: (data) =>
      [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  });
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
  if (isTxLoading) return <div>{i18n.t("massages.loading")}</div>;
  if (isTxError) {
    return <div>{i18n.t("messages.loadingError")} {txError.message}</div>;
  }

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const buttonMenuItems = [
    <Button
      key="inc"
      variant="primary"
      text={i18n.t("buttons.createIncomse")}
      onClick={() => setIsCreateIncomseOpen(true)}
    />,
    <Button
      key="exp"
      variant="cancel"
      text={i18n.t("buttons.createExpense")}
      onClick={() => setIsCreateExpenseOpen(true)}
    />,
    <Button
      key="tra"
      variant="blue"
      text={i18n.t("buttons.createTransfer")}
      onClick={() => setIsCreateTransfer(true)}
    />,
  ];

  return (
    <div className={styles.accountContainer}>
      <h2 className={styles.accountTitle}>{account.name}</h2>
      <div className={styles.divider}></div>
      <div className={styles.totalBalanceContainer}>
        {i18n.t("account.totalBalance")}{" "}
        <span className={styles.totalBalance}>
          {Number(account.totalBalance).toFixed(2)}
        </span>
      </div>


      <div className={styles.transactionsContainer}>
              <div className={styles.rowTitle}>
        <p>{i18n.t("account.amount")}</p>
        <p>{i18n.t("account.category")}</p>
        <p>{i18n.t("account.date")}</p>
        <p>{i18n.t("account.type")}</p>
      </div>

        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Row
              key={transaction.id}
              transaction={transaction}
              onClick={() => handleTransactionClick(transaction)}
            />
          ))
        ) : (
          <p>{i18n.t("account.noTransactions")}</p>
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
