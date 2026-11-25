import React from "react";
import Datepicker from "../inputs/Datepicker";
import { PERIODS } from "../../utils/reports/report";
import overview from "../../styles/components/overview/overview.module.scss";
import styles from "../../styles/pages/report/report.module.scss";
import i18n from "../../configuration/i18n";

// the period of the report: ready-made ones, or two chosen days
const ReportPeriod = ({ period, onPeriodChange, custom, onCustomChange }) => (
  <div className={styles.period}>
    <div className={styles.periods} role="group" aria-label={i18n.t("report.period")}>
      {PERIODS.map((p) => (
        <button
          key={p}
          type="button"
          className={overview.chip}
          aria-pressed={period === p}
          onClick={() => onPeriodChange(p)}
        >
          {i18n.t(`report.periods.${p}`)}
        </button>
      ))}
    </div>
    {period === "custom" && (
      <div className={styles.dates}>
        <div className={styles.date}>
          <span className={overview.muted}>{i18n.t("report.fromDate")}</span>
          <Datepicker value={custom.from} max={custom.to || undefined}
            onChange={(from) => onCustomChange({ ...custom, from })} />
        </div>
        <div className={styles.date}>
          <span className={overview.muted}>{i18n.t("report.toDate")}</span>
          <Datepicker value={custom.to} min={custom.from || undefined}
            onChange={(to) => onCustomChange({ ...custom, to })} />
        </div>
      </div>
    )}
  </div>
);

export default ReportPeriod;