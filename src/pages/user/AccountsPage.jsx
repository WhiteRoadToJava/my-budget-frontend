import React, { useEffect, useState } from 'react'
import Account from '../../components/account/Account'
import { useParams } from 'react-router-dom';
import { getAccountById } from '../../api/accountService';
import i18n from '../../configuration/i18n';
import { useQuery } from "@tanstack/react-query";


const AccountsPage = () => {
  const {accountId} = useParams();
  
  const { data: account } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () => getAccountById(accountId),
  });

  if (!account) return <div>{i18n.t("masseges.loading")}</div>;
  return (
    <div>
      <Account account={account} />
    </div>
  )
}

export default AccountsPage
