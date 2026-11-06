import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/overview/overview.module.scss";
import Row from "../accounts/TransactionRow";
import TransactionInfo from "../transactions/TransactionInfo";
import i18n from "../../configuration/i18n";

// the latest transactions; a click opens the usual details
const RecentTransactions = ({ transactions, accounts, limit = 8 }) => {
  const [selected, setSelected] = useState(null);
  const latest = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

  return (
    <section className={styles.card} aria-labelledby="overview-recent">
      <div className={styles.cardHeader}>
        <h2 id="overview-recent" className={styles.cardTitle}>{i18n.t("overview.recent")}</h2>
        <Link className={styles.link} to="/user/transactions">{i18n.t("overview.viewAll")}</Link>
      </div>
      {latest.length === 0 ? (
        <p className={styles.empty}>{i18n.t("transactionsPage.empty")}</p>
      ) : (
        <ul className={styles.list}>
          {latest.map((t) => (
            <li key={`${t.type}-${t.id}`}>
              <Row transaction={t} onClick={() => setSelected(t)} showAccount />
            </li>
          ))}
        </ul>
      )}
      <TransactionInfo
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        transaction={selected || {}}
        accounts={accounts}
        transactions={transactions}
      />
    </section>
  );
};

export default RecentTransactions;
