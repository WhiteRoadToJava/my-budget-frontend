import React from "react";
import overview from "../../styles/components/overview/overview.module.scss";
import styles from "../../styles/pages/report/report.module.scss";
import i18n from "../../configuration/i18n";
import { formatAmount } from "../../utils/currencies/amountFormat";

// "+12 %" against the period before; good is the direction that is good news
const Change = ({ percent, good }) => {
  if (percent === null) return <span className={overview.muted}>{i18n.t("report.noComparison")}</span>;
  const better = good === "up" ? percent > 0 : percent < 0;
  return (
    <span className={styles.change} data-tone={percent === 0 ? "same" : better ? "good" : "bad"}>
      {percent > 0 ? "+" : ""}{percent} % {i18n.t("report.vsPrevious")}
    </span>
  );
};

// money in, out, net and savings rate of the period
const ReportSummary = ({ report, currency }) => {
  const { totals, changes } = report;
  const money = (amount) => formatAmount(Math.abs(amount), currency);

  return (
    <section className={`${overview.card} ${styles.summary}`} aria-label={i18n.t("report.summary")}>
      <div className={overview.stat}>
        <span className={overview.muted}>{i18n.t("share.moneyIn")}</span>
        <span className={`${overview.statValue} ${overview.in}`}>+ {money(totals.in)}</span>
        <Change percent={changes.in} good="up" />
      </div>
      <div className={overview.stat}>
        <span className={overview.muted}>{i18n.t("share.moneyOut")}</span>
        <span className={`${overview.statValue} ${overview.out}`}>− {money(totals.out)}</span>
        <Change percent={changes.out} good="down" />
      </div>
      <div className={overview.stat}>
        <span className={overview.muted}>{i18n.t("overview.net")}</span>
        <span className={`${overview.statValue} ${totals.net < 0 ? overview.negative : overview.in}`}>
          {totals.net < 0 ? "− " : "+ "}{money(totals.net)}
        </span>
        <Change percent={changes.net} good="up" />
      </div>
      <div className={overview.stat}>
        <span className={overview.muted}>{i18n.t("report.savingsRate")}</span>
        <span className={`${overview.statValue} ${totals.savingsRate < 0 ? overview.negative : ""}`}>
          {totals.savingsRate === null ? "—" : `${totals.savingsRate} %`}
        </span>
        <span className={overview.muted}>{i18n.t("report.transactionsCount", { count: report.count })}</span>
      </div>
    </section>
  );
};

export default ReportSummary;