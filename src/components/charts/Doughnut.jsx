import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../../styles/Charts/dashboard.module.scss";


const COLORS = ["#00C49F", "#FF8042"]; // green = income, red = expense

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function DoughnutChart({ transactions = [] }) {
  // Group by month → { 0: { income: 5000, expense: 2000 }, 4: { ... } }
  const monthlyTotals = transactions.reduce(
    (acc, { type, amount, createdAt }) => {
      const month = new Date(createdAt).getMonth();
      if (!acc[month]) acc[month] = { incomse: 0, expense: 0 };
      if (type === "incomse" || type === "expense") {
        acc[month][type] += amount;
      }
      return acc;
    },
    {},
  );

  // Sort by month number (0 = Jan, 11 = Dec)
  const sortedMonths = Object.entries(monthlyTotals).sort(
    ([a], [b]) => Number(a) - Number(b),
  );

  if (sortedMonths.length === 0) return <p>No transactions found.</p>;

  console.log("monthlyTotals", monthlyTotals);
  console.log("sortedMonths", sortedMonths);

  return (
    <div className={styles.doughnutContainer}>
      {sortedMonths.map(([monthIndex, totals]) => {
        const chartData = [
          { name: "Incomse", value: totals.incomse },
          { name: "Expense", value: totals.expense },
        ].filter((entry) => entry.value > 0);
        return (
          <div key={monthIndex} style={{ marginBottom: "2rem" }}>
            <h3>{MONTH_NAMES[Number(monthIndex)]}</h3>


            <ResponsiveContainer  height={100} className={styles.PieChart} >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={30}
                  paddingAngle={4}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell key={"incomse"} fill={COLORS[0]} />
                  <Cell key={"expense"} fill={COLORS[1]} />
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

export default DoughnutChart;
