import React from "react";
import { getTotalBalance } from '../../api/totalBalance';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import i18n from '../../configuration/i18n';
import styles from '../../styles/Charts/dashboard.module.scss';

const COLORS = ["#5aa9ff", "#d6ff41", "#dabdff", "#f87931"];

function AreaCharts() {
  const {
    data: totalBalance = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["TotalBalance"],
    queryFn: getTotalBalance,
  });

  if (isLoading) return <section className={styles.chartCard}>{i18n.t("dashboard.loading", { defaultValue: "Loading balance..." })}</section>;
  if (isError) return <section className={styles.chartCard}>{i18n.t("dashboard.error", { defaultValue: "Unable to load balance" })}</section>;
  if (!totalBalance.length) return <section className={styles.chartCard}>{i18n.t("dashboard.noData", { defaultValue: "No balance data yet" })}</section>;

  const chartData = totalBalance.map((entry) => ({
    name: new Date(entry.createdAt).toLocaleDateString("sv-SE", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    ...entry.totalBalanceByCurrency,
  }));
  const currencyKeys = Object.keys(totalBalance[0].totalBalanceByCurrency);

  return (
    <section className={styles.chartCard} aria-labelledby="balance-trend-heading">
      <div className={styles.chartHeader}>
        <div>
          <p className={styles.eyebrow}>{i18n.t("dashboard.overview", { defaultValue: "Overview" })}</p>
          <h2 id="balance-trend-heading">{i18n.t("dashboard.balanceTrend", { defaultValue: "Balance trend" })}</h2>
        </div>
        <span className={styles.chartBadge}>{currencyKeys.length} {i18n.t("dashboard.currencies", { defaultValue: "currencies" })}</span>
      </div>
      <div className={styles.chartCanvas}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              {currencyKeys.map((currency, index) => (
                <linearGradient key={currency} id={"balance-" + currency} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.38} />
                  <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="rgba(174, 184, 203, 0.12)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8490aa", fontSize: 11 }} minTickGap={28} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8490aa", fontSize: 11 }} width={48} />
            <Tooltip
              contentStyle={{ background: "#172139", border: "1px solid rgba(174, 184, 203, 0.14)", borderRadius: "12px", color: "#f8fafc" }}
              labelStyle={{ color: "#aeb8cb" }}
              formatter={(value, name) => new Intl.NumberFormat("sv-SE", { style: "currency", currency: name }).format(value)}
            />
            <Legend wrapperStyle={{ color: "#aeb8cb", fontSize: "12px" }} />
            {currencyKeys.map((currency, index) => (
              <Area key={currency} type="monotone" dataKey={currency} stroke={COLORS[index % COLORS.length]} fill={"url(#balance-" + currency + ")"} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default AreaCharts;