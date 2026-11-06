import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, getUserAllTransactions } from "../../api/accountService";
import { getAllSchedule } from "../../api/scheduleService";
import { getDebts } from "../../api/debtService";
import BalancesStrip from "../../components/overview/BalancesStrip";
import MonthSummary from "../../components/overview/MonthSummary";
import CashFlowChart from "../../components/overview/CashFlowChart";
import TopCategories from "../../components/overview/TopCategories";
import RecentTransactions from "../../components/overview/RecentTransactions";
import UpcomingAndDebts from "../../components/overview/UpcomingAndDebts";
import { splitAccounts } from "../../utils/accounts/accountList";
import { summarizeDebts } from "../../utils/debts/summarizeDebts";
import {
  accountCurrencies, monthTotals, monthlyFlows, topExpenseCategories, upcomingSchedules,
} from "../../utils/overview/overview";
import { findCategory } from "../../assiets/categories/assits";
import { categoryName } from "../../utils/transactionTypes";
import styles from "../../styles/components/overview/overview.module.scss";
import i18n from "../../configuration/i18n";

const nameOfCategory = (t) => categoryName(findCategory(t.category, t.type));

// The query keys are the same as on the other pages, so every change
// (they invalidate "accounts", "transactions", "schedules", "debts") updates this page too.
const UserDashboard = () => {
  const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const transactionsQuery = useQuery({ queryKey: ["transactions"], queryFn: getUserAllTransactions });
  const { data: schedules = [] } = useQuery({ queryKey: ["schedules"], queryFn: getAllSchedule });
  const { data: debts = [] } = useQuery({ queryKey: ["debts"], queryFn: getDebts });

  // stable references, so the useMemo calls below run only when the data changes
  const accounts = useMemo(() => accountsQuery.data?.accounts ?? [], [accountsQuery.data]);
  const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data]);
  const { active } = useMemo(() => splitAccounts(accounts), [accounts]);
  const currencies = useMemo(() => accountCurrencies(active), [active]);
  const [chosenCurrency, setChosenCurrency] = useState(null);
  const currency = currencies.includes(chosenCurrency) ? chosenCurrency : currencies[0];

  const thisMonth = useMemo(() => monthTotals(transactions), [transactions]);
  const flows = useMemo(() => monthlyFlows(transactions, currency), [transactions, currency]);
  const top = useMemo(
    () => topExpenseCategories(transactions, currency, nameOfCategory),
    [transactions, currency],
  );
  const upcoming = useMemo(() => upcomingSchedules(schedules), [schedules]);
  const debtTotals = useMemo(() => summarizeDebts(debts), [debts]);
  const currencyOfAccount = (account) => accounts.find((a) => a.id === account?.id)?.currency ?? "";

  if (accountsQuery.isLoading || transactionsQuery.isLoading) {
    return <div className={styles.page}>{i18n.t("messages.loading")}</div>;
  }
  if (accountsQuery.isError || transactionsQuery.isError) {
    return <div className={styles.page}>{i18n.t("overview.error")}</div>;
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{i18n.t("dashboard.overview")}</h2>
      <BalancesStrip activeAccounts={active} />
      <MonthSummary totals={thisMonth} />
      <div className={styles.grid}>
        <CashFlowChart flows={flows} currency={currency} currencies={currencies} onCurrencyChange={setChosenCurrency} />
        <TopCategories categories={top} currency={currency} currencies={currencies} onCurrencyChange={setChosenCurrency} />
        <RecentTransactions transactions={transactions} accounts={accounts} />
        <UpcomingAndDebts upcoming={upcoming} currencyOfAccount={currencyOfAccount} debtTotals={debtTotals} />
      </div>
    </div>
  );
};

export default UserDashboard;
