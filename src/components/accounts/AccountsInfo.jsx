import styles from "../../styles/components/accounts/accountsinfo.module.scss";
import i18n from "../../configuration/i18n";
import React from "react";

const AccountsInfo = ({ accounts }) => {
  return (
    <div className={styles.infoContainer}>

      <div className={styles.infoItem}>
        <span className={styles.title}>
          {i18n.t("accountInfo.totaBalance")}:
        </span>

        {accounts?.totalBalanceByCurrency &&
          Object.entries(accounts.totalBalanceByCurrency).map(([currency, balance]) => (
            <span key={currency} className={styles.value}
            data-type={currency}>
              {currency}: {balance.toLocaleString()}
            </span>
          ))}
      </div>

      <div className={styles.infoItem}>
        <span className={styles.title}>
          {i18n.t("accountInfo.NumberOFAccounts")}:
        </span>
        <span className={styles.value} >{accounts?.accounts?.length || 0}</span>
      </div>

      <div className={styles.infoItem}>
        <span className={styles.title}>
          {i18n.t("accountInfo.lastUpdate")}:
        </span>
        <span className={styles.value}>June 20, 2024</span>
      </div>

    </div>
  );
};

export default AccountsInfo;