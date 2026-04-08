import React from 'react'
import { getAccounts } from '../../api/accountService'
import { useQuery } from '@tanstack/react-query'
import styles from '../../styles/dashboard/dashboard.module.scss'
import Row from '../accounts/Row'



const ViewAccounts = () => {


  const {
    data: data = [],
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    error: accountsError,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAccounts(),
  });
  const accounts = data?.data?.accounts || data?.accounts || [];


  if (isAccountsLoading) {
    return <div>Loading accounts...</div>;
  }
  if (isAccountsError) {
    return <div>Error loading accounts: {accountsError.message}</div>;
  }
  return (
    <div>
      <h2>Accounts</h2>
      {accounts.slice(0, 3).map((account) => (
        <div key={account.id} className={styles.accountContainer}>
          <Row key={account.id} account={account}  />
        </div>
      ))
    }
    </div>
  )
}

export default ViewAccounts
