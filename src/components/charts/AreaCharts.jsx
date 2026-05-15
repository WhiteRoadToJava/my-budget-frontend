import React from 'react'
import { getTotalBalance } from '../../api/totalBalance';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function AreaCharts() {
  const {
    data: totalBalance = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["TotalBalance"],
    queryFn: getTotalBalance,
  });

  if (isLoading) return <div>Loading balance...</div>;
  if (isError) return <div>Error loading balance: {error.message}</div>;
  if (!totalBalance.length) return <div>No data available.</div>;

  const chartData = totalBalance.map((entry) => ({
    name: new Date(entry.createdAt).toLocaleDateString("sv-SE", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...entry.totalBalanceByCurrency,
  }));

  // Extract currency keys from first entry
  const currencyKeys = Object.keys(totalBalance[0].totalBalanceByCurrency);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value, name) =>
            new Intl.NumberFormat("sv-SE", {
              style: "currency",
              currency: name,
            }).format(value)
          }
        />
        <Legend />
        {currencyKeys.map((currency, index) => (
          <Area
            key={currency}
            dataKey={currency}
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            stackId="1"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default AreaCharts;