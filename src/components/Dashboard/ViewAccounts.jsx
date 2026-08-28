import React from "react";
import styles from '../../styles/dashboard/dashboard.module.scss';
import Row from '../accounts/AccountRow';
import i18n from '../../configuration/i18n';

const ViewAccounts = ({ data = [], isError, error, isLoading }) => {
  if (isLoading) {
    return <div className={styles.accountContainer}>{i18n.t("messages.loadingAccounts", { defaultValue: "Loading accounts..." })}</div>;
  }

  if (isError || error) {
    return <div className={styles.accountContainer}>{i18n.t("messages.errorLoadingAccounts", { defaultValue: "Unable to load accounts" })}</div>;
  }

  return (
    <section className={styles.accountContainer} aria-labelledby="accounts-heading">
      <h2 id="accounts-heading">{i18n.t("viewAccounts.title", { defaultValue: "Accounts" })}</h2>
      <div className={styles.accountList}>
        {data.slice(0, 3).map((account) => (
          <Row key={account.id} account={account} />
        ))}
      </div>
    </section>
  );
};

export default ViewAccounts;