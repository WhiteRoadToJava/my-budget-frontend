import React, { useEffect, useState } from 'react'
import Account from '../../components/account/Account'
import { useParams } from 'react-router-dom';
import { getAccountById } from '../../api/accountService';
import i18n from '../../configuration/i18n';

const AccountsPage = () => {
  const {accountId} = useParams();
  const[account, setAccount] = useState(null);
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getAccountById(accountId);
        setAccount(data);
      } catch (error) {
        console.error("Failed to load account", error);
      }
    };
    fetchAccount();
  }, [accountId]);
  if (!account) return <div>{i18n.t("masseges.loading")}</div>;
  return (
    <div>
      <Account account={account} />
    </div>
  )
}

export default AccountsPage
