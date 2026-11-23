import React, { useState } from "react";
import Row from "../accounts/TransactionRow";
import TransactionInfo from "../transactions/TransactionInfo";
import { rowKey } from "../../utils/transactions/transactionList";
import overview from "../../styles/components/overview/overview.module.scss";
import i18n from "../../configuration/i18n";

// the biggest transactions of the period; a click opens the usual details
const BiggestTransactions = ({ rows, accounts, transactions }) => {
  const [selected, setSelected] = useState(null);
  return (
    <section className={overview.card} aria-label={i18n.t("report.biggest")}>
      <h3 className={overview.cardTitle}>{i18n.t("report.biggest")}</h3>
      {rows.length === 0 ? (
        <p className={overview.empty}>{i18n.t("report.nothingInPeriod")}</p>
      ) : (
        <ul className={overview.list}>
          {rows.map((t) => (
            <li key={rowKey(t)}>
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

export default BiggestTransactions;