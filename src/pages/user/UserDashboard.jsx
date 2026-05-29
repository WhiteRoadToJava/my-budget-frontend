import React from "react";
import styles from "../../styles/dashboard/dashboard.module.scss";
import ViewAccounts from "../../components/Dashboard/ViewAccounts";
import ViewTransations from "../../components/Dashboard/ViewTransations";
import Charts from "../../components/charts/AreaCharts";
import Doughnut from "../../components/charts/Doughnut";
import DoughnutChart from "../../components/charts/Doughnut";
import { getAllIncomseAndExpensesTransactions } from "../../api/accountService";
import { getAccounts } from '../../api/accountService'

import { useQuery } from "@tanstack/react-query";
import sortingTransactions from "../../utils/sorting";
import i18n from "../../configuration/i18n";



const UserDashboard = () => {

const {
  data: transactionData = [],
  isLoading: isTransactionsLoading,
  isError: isTransactionsError,
  error: transactionsError,
} = useQuery({
  queryKey: ["transactions"],
  queryFn: () => getAllIncomseAndExpensesTransactions(),
  select: (data) =>
    [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
});

const {
  data: accounts = [],
  isLoading: isAccountsLoading,
  isError: isAccountsError,
  error: accountsError,
} = useQuery({
  queryKey: ["accounts"],
  queryFn: () => getAccounts(), // your accounts fetch function
});

  const transactions = sortingTransactions(transactionData);

  if (isAccountsLoading) {
    return <div>{i18n.t("messages.loadingAccounts")}</div>;
  }
  if (isAccountsError) {
    return <div>{i18n.t("messages.errorLoadingAccounts")} {accountsError.message}</div>;
  }
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.leftSide}>
        <ViewAccounts data={accounts.accounts}  isError={isAccountsError} error={transactionsError} isLoading={isAccountsLoading} />
        <ViewTransations data={transactions} isError={isTransactionsLoading} error={isTransactionsError} isLoading={isTransactionsLoading}/>
      </div>
      <div className={styles.rightSide}>
        <Charts  />
        <DoughnutChart transactions={transactions} />
      </div>
    </div>
  );
};

export default UserDashboard;
