import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, getUserAllTransactions } from "../../../api/accountService";
import TransactionInfo from "../../../components/transactions/TransactionInfo";
import TransactionList from "../../../components/transactions/TransactionList";
import TransactionFilters from "../../../components/transactions/TransactionFilters";
import { filterTransactions } from "../../../utils/transactions/transactionList";
import { findCategory } from "../../../assiets/categories/assits";
import { categoryName } from "../../../utils/transactionTypes";
import styles from "../../../styles/components/transactions/transactionsPage.module.scss";
import i18n from "../../../configuration/i18n";

const nameOfCategory = (t) => categoryName(findCategory(t.category, t.type));

const AllTransactions = () => {
  const [selected, setSelected] = useState(null);
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ["transactions"],
    queryFn: getUserAllTransactions,
  });
  const { data: accountsData } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });

  const visible = useMemo(
    () => filterTransactions(transactions, { type, query, categoryName: nameOfCategory }),
    [transactions, type, query],
  );

  if (isLoading) return <div className={styles.page}>{i18n.t("messages.loading")}</div>;
  if (isError) return <div className={styles.page}>{i18n.t("messages.errorLoadingTransactions")}</div>;

  const filtered = type !== "all" || query.trim();

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("transactionsPage.title")}</h2>
      <TransactionFilters type={type} onTypeChange={setType} query={query} onQueryChange={setQuery} />
      <TransactionList
        transactions={visible}
        onSelect={setSelected}
        showAccount
        emptyText={filtered ? i18n.t("transactionsPage.noMatch") : i18n.t("transactionsPage.empty")}
      />
      <TransactionInfo
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        transaction={selected || {}}
        accounts={accountsData?.accounts ?? []}
        transactions={transactions}
      />
    </div>
  );
};

export default AllTransactions;
