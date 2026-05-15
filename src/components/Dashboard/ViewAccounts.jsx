import React from 'react'
import { getAccounts } from '../../api/accountService'
import { useQuery } from '@tanstack/react-query'
import styles from '../../styles/dashboard/dashboard.module.scss'
import Row from '../accounts/Row'



const ViewAccounts = ({data = [], isError, error, isLoading }) => {




  if (isLoading) {
    return <div>Loading accounts...</div>;
  }
  if (error) {
    return <div>Error loading accounts: {error.message}</div>;
  }
  return (
    <div className={styles.accountContainer}>
      <h2>Accounts</h2>
      {data.slice(0, 3).map((account) => (
        <div key={account.id} className={styles.accountContainer}>
          <Row key={account.id} account={account}  />
        </div>
      ))
    }
    </div>
  )
}

export default ViewAccounts
