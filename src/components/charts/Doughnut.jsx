import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "../../styles/Charts/dashboard.module.scss";

const COLORS = ["#d6ff41", "#ff6b78"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function DoughnutChart({ transactions = [] }) {
  const monthlyTotals = transactions.reduce((acc, item) => {
    const date = new Date(item.createdAt);
    const key = date.getMonth() + "-" + date.getFullYear();
    if (!acc[key]) acc[key] = { incomse: 0, expense: 0 };
    if (item.type === "incomse") acc[key].incomse += item.amount;
    else acc[key].expense += item.amount;
    return acc;
  }, {});

  const sortedMonths = Object.entries(monthlyTotals).sort((a, b) => {
    const [monthA, yearA] = a[0].split("-").map(Number);
    const [monthB, yearB] = b[0].split("-").map(Number);
    return yearB - yearA || monthB - monthA;
  });

  return (
    <section className={styles.chartCard} aria-labelledby="monthly-summary-heading">
      <div className={styles.chartHeader}>
        <div>
          <p className={styles.eyebrow}>Summary</p>
          <h2 id="monthly-summary-heading">Monthly activity</h2>
        </div>
      </div>
      {sortedMonths.length === 0 ? (
        <p className={styles.emptyChart}>No monthly activity yet</p>
      ) : (
        <div className={styles.doughnutContainer}>
          {sortedMonths.map(([monthIndex, totals]) => {
            const chartData = [
              { name: "Income", value: totals.incomse, color: COLORS[0] },
              { name: "Expense", value: totals.expense, color: COLORS[1] },
            ].filter((entry) => entry.value > 0);
            return (
              <div className={styles.monthCard} key={monthIndex}>
                <h3>{MONTH_NAMES[Number(monthIndex)]}</h3>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="46%" innerRadius={42} outerRadius={64} paddingAngle={4}>
                      {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#172139", border: "1px solid rgba(174, 184, 203, 0.14)", borderRadius: "12px" }} />
                    <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: "11px", color: "#aeb8cb" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default DoughnutChart;