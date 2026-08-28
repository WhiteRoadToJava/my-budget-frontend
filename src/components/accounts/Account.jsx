import React, { useState, useMemo, useEffect } from "react";
import styles from "../../styles/components/accounts/account.module.scss";
import Row from "./TransactionRow";
import { getAccountById, getAccounts, getAllAccountTransactions } from "../../api/accountService";
import Button from "../btns/Button";
import CreateIncome from "../incomes/CreateIncome";
import CreateExpense from "../expenses/CreateExpense";
import ToogleMenu from "../elements/ToggleMenu";
import { useQuery } from "@tanstack/react-query";
import TransactionInfo from "../transactions/TransactionInfo";
import CreateTransfer from "../transfers/CreateTransfer";
import i18n from "../../configuration/i18n";

const Account = ({ account }) => {
  const [isCreateIncomeOpen, setIsCreateIncomeOpen] = useState(false);
  const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isCreateTransfer, setIsCreateTransfer] = useState(false);
  const [totalBalance, setTotalBalance] = useState(account.totalBalance || 0);

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
const handleTotalBalance = async () => {
  const accountData = await getAccountById(account.id);
  if (!accountData) return;
  setTotalBalance(accountData.totalBalance);
};
  useEffect(() => {
    // Deliberate: re-fetches the account's server-computed total balance
    // whenever the transactions list changes. Not a pure prop->state sync,
    // so it can't be computed during render. Candidate for a react-query
    // refactor (tracked separately) instead of this eslint-disable long term.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleTotalBalance();
  }, [transactions]);
  
  const months = useMemo(() => {
    const seen = new Set();
    const result = [];
    transactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          key,
          label: date.toLocaleString("default", { month: "long", year: "numeric" }),
        });
      }
    });
    return result;
  }, [transactions]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  if (isTxLoading) return <div>{i18n.t("messages.loading")}</div>;
  if (isTxError) {
    return (
      <div>
        {i18n.t("messages.loadingError")} {txError.message}
      </div>
    );
  }

  const buttonMenuItems = [
    <Button key="inc" variant="primary" text={i18n.t("buttons.createIncomse")} onClick={() => setIsCreateIncomeOpen(true)} />,
    <Button key="exp" variant="cancel" text={i18n.t("buttons.createExpense")} onClick={() => setIsCreateExpenseOpen(true)} />,
    <Button key="tra" variant="blue" text={i18n.t("buttons.createTransfer")} onClick={() => setIsCreateTransfer(true)} />,
  ];

  return (
    <div className={styles.accountContainer}>
      <h2 className={styles.accountTitle}>{account.name}</h2>
      <div className={styles.divider}></div>
      <div className={styles.totalBalanceContainer}>
        {i18n.t("account.totalBalance")}{" "}
        <span
          className={styles.totalBalance}
          data-balance={totalBalance < 0 ? "negative" : "positive"}
        >
          {Number(totalBalance).toFixed(2)}
        </span>
      </div>

      <div className={styles.transactionsContainer}>
        <div className={styles.rowTitle}>
          <p>{i18n.t("account.amount")}</p>
          <p>{i18n.t("account.category")}</p>
          <p>{i18n.t("account.date")}</p>
          <p>{i18n.t("account.type")}</p>
        </div>

        {months.length > 0 ? (
          months.map(({ key, label }) => (
            <div key={key}>
              <h3 className={styles.monthHeader}>{label}</h3>
              {transactions
                .filter((t) => {
                  const d = new Date(t.createdAt);
                  return `${d.getFullYear()}-${d.getMonth()}` === key;
                })
                .map((transaction) => (
                  <Row
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => handleTransactionClick(transaction)}
                  />
                ))}
            </div>
          ))
        ) : (
          <p>{i18n.t("account.noTransactions")}</p>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <ToogleMenu menuList={buttonMenuItems} position="bottom" />
      </div>

      <CreateIncome isOpen={isCreateIncomeOpen} isClose={() => setIsCreateIncomeOpen(false)} account={account} />
      <CreateExpense isOpen={isCreateExpenseOpen} isClose={() => setIsCreateExpenseOpen(false)} account={account} />
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