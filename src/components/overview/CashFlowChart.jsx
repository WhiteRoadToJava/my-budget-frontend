import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import styles from "../../styles/components/overview/overview.module.scss";
import CurrencyChips from "./CurrencyChips";
import { formatMoney } from "../../utils/accounts/accountStatement";
import { dateFnsLocale } from "../../utils/dates";
import i18n from "../../configuration/i18n";

// money in and out for the last six months, in one currency
const CashFlowChart = ({ flows, currency, currencies, onCurrencyChange }) => {
  const locale = dateFnsLocale(i18n.language);
  const data = flows.map((f) => ({
    name: format(parseISO(`${f.key}-01`), "MMM", { locale }),
    in: f.in,
    out: f.out,
  }));
  const hasData = flows.some((f) => f.in > 0 || f.out > 0);
  const rtl = i18n.language === "ar";

  return (
    <section className={styles.card} aria-labelledby="overview-flow">
      <div className={styles.cardHeader}>
        <h2 id="overview-flow" className={styles.cardTitle}>{i18n.t("overview.cashFlow")}</h2>
        <CurrencyChips currencies={currencies} value={currency} onChange={onCurrencyChange} />
      </div>
      {!hasData ? (
        <p className={styles.empty}>{i18n.t("overview.noActivity")}</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }} barGap={2}>
            <CartesianGrid stroke="rgba(174, 184, 203, 0.12)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" reversed={rtl} axisLine={false} tickLine={false} tick={{ fill: "#8490aa", fontSize: 11 }} />
            <YAxis orientation={rtl ? "right" : "left"} axisLine={false} tickLine={false} width={56}
              tick={{ fill: "#8490aa", fontSize: 11 }} tickFormatter={(v) => new Intl.NumberFormat("en", { notation: "compact" }).format(v)} />
            <Tooltip
              cursor={{ fill: "rgba(174, 184, 203, 0.08)" }}
              contentStyle={{ background: "#172139", border: "1px solid rgba(174, 184, 203, 0.14)", borderRadius: "12px", color: "#f8fafc" }}
              formatter={(value, name) => [`${formatMoney(value, i18n.language)} ${currency}`, name]}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#aeb8cb" }} />
            <Bar dataKey="in" name={i18n.t("share.moneyIn")} fill="#8be28b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="out" name={i18n.t("share.moneyOut")} fill="#ff6b78" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

export default CashFlowChart;
