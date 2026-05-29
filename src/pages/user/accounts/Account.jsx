import React from "react";
import { getAccounts } from "../../../api/accountService";
import AccountComponent from "../../../components/accounts/AccountComponent";
// 1. استيراد useQuery
import { useQuery } from "@tanstack/react-query";
import i18n from "../../../configuration/i18n";

const Account = () => {
  // 2. استبدال useEffect و useState بـ useQuery
  const { 
    data: accounts = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ["accounts"], 
    queryFn: getAccounts, 
  });

  if (isLoading) return <div>{i18n.t("messages.loadingAccounts")}</div>;

  if (isError) {
    return <div> {i18n.t("messages.errorLoadingAccounts")}</div>;
  }

  return (
    <div>
      
      <AccountComponent accounts={accounts} />
    </div>
  );
};

export default Account;