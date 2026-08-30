import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAllTransactions, getAccounts } from "../../api/accountService";
import CalendarComponent from "../../components/calendar/CalendarComponent";
import i18n from "../../configuration/i18n";

const CalendarPage = () => {
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getUserAllTransactions(),
  });

  const {
    data: accountsData = { accounts: [] },
    isLoading: isAccountsLoading,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  });

  if (isTransactionsLoading || isAccountsLoading) {
    return <div>{i18n.t("loading")}</div>;
  }

  if (isTransactionsError) {
    return (
      <div>
        {i18n.t("calendar.errorLoading")}: {transactionsError.message}
      </div>
    );
  }

  return (
    <CalendarComponent
      transactions={transactions}
      accounts={accountsData.accounts}
    />
  );
};

export default CalendarPage;
