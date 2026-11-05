import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, getAllAccountTransactions } from "../../api/accountService";
import Button from "../btns/Button";
import PlusIcon from "../icons/btns/PlusIcon";
import CreateIncome from "../incomes/CreateIncome";
import CreateExpense from "../expenses/CreateExpense";
import CreateTransfer from "../transfers/CreateTransfer";
import TransactionInfo from "../transactions/TransactionInfo";
import TransactionList from "../transactions/TransactionList";
import TransactionFilters from "../transactions/TransactionFilters";
import ShareStatement from "./ShareStatement";
import { filterTransactions } from "../../utils/transactions/transactionList";
import { changeSinceOpening } from "../../utils/accounts/accountList";
import { findCategory } from "../../assiets/categories/assits";
import { categoryName } from "../../utils/transactionTypes";
import { formatNumber } from "../../utils/formating";
import styles from "../../styles/components/transactions/transactionsPage.module.scss";
import i18n from "../../configuration/i18n";

const nameOfCategory = (t) => categoryName(findCategory(t.category, t.type));

const Account = ({ account }) => {
  const [isCreateIncomeOpen, setIsCreateIncomeOpen] = useState(false);
  const [isCreateExpenseOpen, setIsCreateExpenseOpen] = useState(false);
  const [isCreateTransfer, setIsCreateTransfer] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ["transactions", account.id],
    queryFn: () => getAllAccountTransactions(account),
  });

  // every change invalidates ["accounts"], so the balance shown here stays current
  // without fetching the account again by hand
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const current = accounts?.accounts?.find((a) => a.id === account.id) ?? account;
  const total = Number(current.totalBalance ?? 0);
  const change = changeSinceOpening(current);
  const typeKey = `accountsPage.types.${current.type}`;

  const visible = useMemo(
    () => filterTransactions(transactions, { type, query, categoryName: nameOfCategory }),
    [transactions, type, query],
  );

  return (
    <div className={styles.page}>
      <Link className={styles.back} to="/user/accounts">{i18n.t("transactionsPage.backToAccounts")}</Link>

      <div className={styles.accountHeader}>
        <div>
          <h2 className={styles.title}>{current.name}</h2>
          <p className={styles.accountType}>
            {i18n.exists(typeKey) ? i18n.t(typeKey) : current.type}
          </p>
        </div>
        <p className={styles.balance}>
          <span className={`${styles.balanceAmount} ${total < 0 ? styles.negative : ""}`}>
            {formatNumber(total)}
            <span className={styles.balanceCurrency}>{current.currency}</span>
          </span>
          <span className={styles.change}>
            {change >= 0 ? "+" : "−"}
            {formatNumber(Math.abs(change))} {i18n.t("accountsPage.sinceOpening")}
          </span>
        </p>
      </div>

      <div className={styles.actions}>
        <Button variant="primary" Icon={PlusIcon} text={i18n.t("buttons.createIncomse")}
          onClick={() => setIsCreateIncomeOpen(true)} />
        <Button variant="cancel" Icon={PlusIcon} text={i18n.t("buttons.createExpense")}
          onClick={() => setIsCreateExpenseOpen(true)} />
        <Button variant="blue" text={i18n.t("buttons.createTransfer")}
          onClick={() => setIsCreateTransfer(true)} />
        <Button variant="secondary" text={i18n.t("share.button")}
          onClick={() => setIsShareOpen(true)} disabled={isLoading} />
      </div>

      <TransactionFilters type={type} onTypeChange={setType} query={query} onQueryChange={setQuery} />

      {isLoading ? (
        <p>{i18n.t("messages.loading")}</p>
      ) : isError ? (
        <p>{i18n.t("messages.errorLoadingTransactions")}</p>
      ) : (
        <TransactionList
          transactions={visible}
          onSelect={setSelected}
          emptyText={
            type !== "all" || query.trim()
              ? i18n.t("transactionsPage.noMatch")
              : i18n.t("account.noTransactions")
          }
        />
      )}

      <CreateIncome isOpen={isCreateIncomeOpen} isClose={() => setIsCreateIncomeOpen(false)} account={current} />
      <CreateExpense isOpen={isCreateExpenseOpen} isClose={() => setIsCreateExpenseOpen(false)} account={current} />
      <CreateTransfer
        isOpen={isCreateTransfer}
        isClose={() => setIsCreateTransfer(false)}
        accounts={accounts}
        currentAccount={current}
      />
      <ShareStatement
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        account={current}
        transactions={transactions}
      />
      <TransactionInfo
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        transaction={selected || {}}
        currentAccount={current}
        accounts={accounts}
        transactions={transactions}
      />
    </div>
  );
};

export default Account;
