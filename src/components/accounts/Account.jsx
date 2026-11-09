import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccounts, getAllAccountTransactions, removeAccountCurrency } from "../../api/accountService";
import AddCurrencyModal from "./AddCurrencyModal";
import DeleteConfirmation from "../modals/DeleteConfirmation";
import { chosenCurrency, changeSinceOpeningOf, pocketOf, pocketsOf, transactionCurrency } from "../../utils/accounts/pockets";
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
  const [addingCurrency, setAddingCurrency] = useState(false);
  const [removingCurrency, setRemovingCurrency] = useState(false);
  const [currencyError, setCurrencyError] = useState(null);
  const [params, setParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ["transactions", account.id],
    queryFn: () => getAllAccountTransactions(account),
  });

  // every change invalidates ["accounts"], so the balance shown here stays current
  // without fetching the account again by hand
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const current = accounts?.accounts?.find((a) => a.id === account.id) ?? account;
  // one tab per currency; the chosen one is in the address (?currency=USD)
  const pockets = pocketsOf(current);
  const currency = chosenCurrency(current, params.get("currency"));
  const pocket = pocketOf(current, currency);
  const total = Number(pocket?.totalBalance ?? 0);
  const change = changeSinceOpeningOf(pocket);
  const chooseCurrency = (code) => {
    setCurrencyError(null);
    setParams({ currency: code }, { replace: true });
  };

  const removeMutation = useMutation({
    mutationFn: () => removeAccountCurrency(current.id, currency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setRemovingCurrency(false);
      setParams({}, { replace: true });
    },
    onError: (err) => {
      setRemovingCurrency(false);
      setCurrencyError(err?.response?.status === 409 ? i18n.t("currencies.hasTransactions") : i18n.t("currencies.saveError"));
    },
  });
  const typeKey = `accountsPage.types.${current.type}`;

  // the rows of the chosen currency (a row without currency is from before: the account's only one)
  const inCurrency = transactions.filter((t) => !transactionCurrency(t) || transactionCurrency(t) === currency);
  const visible = filterTransactions(inCurrency, { type, query, categoryName: nameOfCategory });

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
            <span className={styles.balanceCurrency}>{currency}</span>
          </span>
          <span className={styles.change}>
            {change >= 0 ? "+" : "−"}
            {formatNumber(Math.abs(change))} {i18n.t("accountsPage.sinceOpening")}
          </span>
        </p>
      </div>

      <div className={styles.currencyTabs} role="tablist" aria-label={i18n.t("createAccount.currency")}>
        {pockets.map((p) => (
          <button key={p.currency} type="button" role="tab" className={styles.currencyTab}
            aria-selected={p.currency === currency} onClick={() => chooseCurrency(p.currency)}>
            <span className={styles.currencyCode}>{p.currency}</span>
            <span className={`${styles.currencyAmount} ${Number(p.totalBalance) < 0 ? styles.negative : ""}`}>
              {formatNumber(Number(p.totalBalance ?? 0))}
            </span>
          </button>
        ))}
        <button type="button" className={styles.currencyTab} onClick={() => setAddingCurrency(true)}>
          <span className={styles.currencyCode}>+</span>
          <span className={styles.currencyAmount}>{i18n.t("currencies.add")}</span>
        </button>
      </div>
      {currencyError && <p className={styles.currencyError} role="alert">{currencyError}</p>}

      <div className={styles.actions}>
        <Button variant="primary" Icon={PlusIcon} text={i18n.t("buttons.createIncomse")}
          onClick={() => setIsCreateIncomeOpen(true)} />
        <Button variant="cancel" Icon={PlusIcon} text={i18n.t("buttons.createExpense")}
          onClick={() => setIsCreateExpenseOpen(true)} />
        <Button variant="blue" text={i18n.t("buttons.createTransfer")}
          onClick={() => setIsCreateTransfer(true)} />
        <Button variant="secondary" text={i18n.t("share.button")}
          onClick={() => setIsShareOpen(true)} disabled={isLoading} />
        {pockets.length > 1 && (
          <Button variant="delete-outlined" text={i18n.t("currencies.remove", { currency })}
            onClick={() => setRemovingCurrency(true)} />
        )}
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

      <CreateIncome isOpen={isCreateIncomeOpen} isClose={() => setIsCreateIncomeOpen(false)} account={current} currency={currency} />
      <CreateExpense isOpen={isCreateExpenseOpen} isClose={() => setIsCreateExpenseOpen(false)} account={current} currency={currency} />
      <CreateTransfer
        isOpen={isCreateTransfer}
        isClose={() => setIsCreateTransfer(false)}
        accounts={accounts}
        currentAccount={current}
        currentCurrency={currency}
      />
      <ShareStatement
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        account={current}
        transactions={transactions}
        currency={currency}
      />
      {addingCurrency && (
        <AddCurrencyModal account={current} onClose={() => setAddingCurrency(false)} onAdded={chooseCurrency} />
      )}
      <DeleteConfirmation
        isOpen={removingCurrency}
        onClose={() => setRemovingCurrency(false)}
        onDelete={() => removeMutation.mutate()}
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
