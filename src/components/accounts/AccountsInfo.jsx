import styles from '../../styles/components/accounts/accountsinfo.module.scss';

import React from 'react'

const AccountsInfo = ({accounts}) => {
  console.log(accounts)
  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoItem}>
        <span className={styles.title}>Total Balance:</span>
        <span className={styles.value}>${accounts?.totalBalance}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.title}>Number of Accounts:</span>
        <span className={styles.value}>{accounts?.accounts?.length || 0}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.title}>Last Updated:</span>
        <span className={styles.value}>June 20, 2024</span>
      </div>
    </div>
  )
}

export default AccountsInfo
