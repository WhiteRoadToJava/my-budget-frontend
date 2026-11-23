import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAccounts, getUserAllTransactions } from "../../api/accountService";
import CurrencyChips from "../overview/CurrencyChips";
import CashFlowChart from "../overview/CashFlowChart";
import ReportPeriod from "./ReportPeriod";
import ReportSummary from "./ReportSummary";
import CategoryBreakdown from "./CategoryBreakdown";
import BiggestTransactions from "./BiggestTransactions";
import { buildReport, periodRange, reportCurrencies, reportCurrency } from "../../utils/reports/report";
import { useBaseCurrency } from "../../hooks/usePreferences";
import overview from "../../styles/components/overview/overview.module.scss";
import styles from "../../styles/pages/report/report.module.scss";
import i18n from "../../configuration/i18n";

// The report of a period: totals compared with the period before, where the money went
// and came from, month by month, and the biggest transactions. One currency at a time.
// It uses the same "transactions" query as the other pages, so it is always up to date.
const ReportComponent = () => {
  const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
  const transactionsQuery = useQuery({ queryKey: ["transactions"], queryFn: getUserAllTransactions });
  const accounts = useMemo(() => accountsQuery.data?.accounts ?? [], [accountsQuery.data]);
  const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data]);

  const [period, setPeriod] = useState("thisMonth");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [chosenCurrency, setChosenCurrency] = useState(null);
  const baseCurrency = useBaseCurrency();

  const currencies = useMemo(() => reportCurrencies(transactions), [transactions]);
  const currency = reportCurrency(currencies, chosenCurrency, baseCurrency);
  const range = useMemo(() => periodRange(period, new Date(), custom), [period, custom]);
  const report = useMemo(
    () => (range && currency ? buildReport(transactions, currency, range) : null),
    [transactions, currency, range],
  );

  if (accountsQuery.isLoading || transactionsQuery.isLoading) {
    return <div className={overview.page}>{i18n.t("messages.loading")}</div>;
  }
  if (accountsQuery.isError || transactionsQuery.isError) {
    return <div className={overview.page}>{i18n.t("report.error")}</div>;
  }

  return (
    <div className={overview.page}>
      <div className={styles.header}>
        <h2 className={overview.title}>{i18n.t("report.title")}</h2>
        <CurrencyChips currencies={currencies} value={currency} onChange={setChosenCurrency} />
      </div>

      <ReportPeriod period={period} onPeriodChange={setPeriod} custom={custom} onCustomChange={setCustom} />

      {!currency ? (
        <p className={overview.empty}>{i18n.t("report.noTransactions")}</p>
      ) : !report ? (
        <p className={overview.empty}>{i18n.t("report.chooseDates")}</p>
      ) : (
        <>
          <ReportSummary report={report} currency={currency} />
          <div className={overview.grid}>
            <CategoryBreakdown title={i18n.t("report.expensesByCategory")} groups={report.expenses} currency={currency} />
            <CategoryBreakdown title={i18n.t("report.incomeByCategory")} groups={report.incomes} currency={currency} incoming />
            {report.monthly.length > 1 && (
              <CashFlowChart title={i18n.t("report.byMonth")} flows={report.monthly} currency={currency} currencies={[currency]} />
            )}
            <BiggestTransactions rows={report.biggest} accounts={accounts} transactions={transactions} />
          </div>
          <p className={overview.muted}>{i18n.t("report.rules")}</p>
        </>
      )}
    </div>
  );
};

export default ReportComponent;