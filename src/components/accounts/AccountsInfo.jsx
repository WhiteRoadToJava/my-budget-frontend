import styles from '../../styles/components/accounts/accountsinfo.module.scss';
import i18n from '../../configuration/i18n';
import React from 'react'

const AccountsInfo = ({accounts}) => {
  console.log(accounts)
  return (
    <div className={styles.infoContainer}>
      <div className={styles.infoItem}>
        <span className={styles.title}>{i18n.t("accountInfo.totaBalance")}:</span>
        <span className={styles.value}>${accounts?.totalBalance}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.title}>{i18n.t("accountInfo.NumberOFAccounts")}:</span>
        <span className={styles.value}>{accounts?.accounts?.length || 0}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.title}>{i18n.t("accountInfo.lastUpdate")}:</span>
        <span className={styles.value}>June 20, 2024</span>
      </div>
    </div>
  )
}

export default AccountsInfo
