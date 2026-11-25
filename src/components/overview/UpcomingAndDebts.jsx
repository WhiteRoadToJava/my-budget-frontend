import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import styles from "../../styles/components/overview/overview.module.scss";
import { scheduleTypeKey } from "../../utils/debts/scheduleTypes";
import { dateFnsLocale } from "../../utils/dates";
import i18n from "../../configuration/i18n";
import { formatAmount } from "../../utils/currencies/amountFormat";

const INCOMING = new Set(["INCOMSE"]);

// what is going to happen soon, and what is owed
const UpcomingAndDebts = ({ upcoming, currencyOfAccount, debtTotals }) => {
  const locale = dateFnsLocale(i18n.language);
  const hasDebts = debtTotals.some((d) => d.owedByMe > 0 || d.owedToMe > 0);

  return (
    <section className={styles.card} aria-labelledby="overview-upcoming">
      <div className={styles.cardHeader}>
        <h2 id="overview-upcoming" className={styles.cardTitle}>{i18n.t("overview.upcoming")}</h2>
        <Link className={styles.link} to="/user/schedule">{i18n.t("overview.viewAll")}</Link>
      </div>
      {upcoming.length === 0 ? (
        <p className={styles.empty}>{i18n.t("overview.nothingUpcoming")}</p>
      ) : (
        <ul className={styles.list}>
          {upcoming.map((s) => {
            const incoming = INCOMING.has(s.transactionType);
            return (
              <li key={s.id} className={styles.upcoming}>
                <span className={styles.muted}>{format(s.due, "d MMM", { locale })}</span>
                <span className={styles.upcomingName}>
                  {s.name || i18n.t(scheduleTypeKey(s.transactionType))}
                </span>
                <span className={incoming ? styles.in : styles.out}>
                  {incoming ? "+ " : "− "}
                  {formatAmount(s.amountSend, currencyOfAccount(s.sourceAccount))}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {hasDebts && (
        <>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{i18n.t("debts.title")}</h2>
            <Link className={styles.link} to="/user/debts">{i18n.t("overview.viewAll")}</Link>
          </div>
          {debtTotals.map((d) => (
            <div key={d.currency} className={styles.debts}>
              <span>{i18n.t("debts.owedByMe")}: <strong>{formatAmount(d.owedByMe, d.currency)}</strong></span>
              <span>{i18n.t("debts.owedToMe")}: <strong>{formatAmount(d.owedToMe, d.currency)}</strong></span>
            </div>
          ))}
        </>
      )}
    </section>
  );
};

export default UpcomingAndDebts;
