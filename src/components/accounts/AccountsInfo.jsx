import styles from '../../styles/components/accounts/accountsinfo.module.scss';

import React from 'react'

const AccountsInfo = ({AccountsInfo}) => {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoItem}>
        <span>Total Balance:</span>
        <span>$10,000.00</span>
      </div>
      <div className={styles.infoItem}>
        <span>Number of Accounts:</span>
        <span>5</span>
      </div>
      <div className={styles.infoItem}>
        <span>Last Updated:</span>
        <span>June 20, 2024</span>
      </div>
    </div>
  )
}

export default AccountsInfo
