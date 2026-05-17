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
  // Group transactions by "month-year" key
const monthlyTotals = transactions.reduce((acc, item) => {
  const date = new Date(item.createdAt);
  const month = date.getMonth();
  const year = date.getFullYear();
  const key = `${month}-${year}`;

  if (!acc[key]) {
    acc[key] = { incomse: 0, expense: 0 };
  }

  if (item.type === "incomse") {
    acc[key].incomse += item.amount;
  } else {
    acc[key].expense += item.amount;
  }

  return acc;



}, {});
  const sortedMonths = Object.entries(monthlyTotals).sort((a, b) => {
    const [monthA, yearA] = a[0].split("-");
    const [monthB, yearB] = b[0].split("-");
    if (yearA === yearB) {
      return monthB - monthA;
    }
    return yearA - yearB  
  }
)

console.log(sortedMonths)


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

                >
                  <Cell key={"incomse"} fill={totals.incomse ? COLORS[0] : COLORS[1]}  />
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
