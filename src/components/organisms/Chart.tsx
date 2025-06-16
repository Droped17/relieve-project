"use client";

import { INCOME } from "@/src/app/graphql/queries/transaction.query";
import { useQuery } from "@apollo/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const MyChart = () => {

  const {data, loading, error} = useQuery(INCOME)

  if (loading) return <p>Loading..</p>
  if (error) return <p>{error.message}</p>

  const incomeData = {
    labels: data.incomePerMonth.data.map((item: { month: string; }) => item.month),
    datasets: [
      {
        label: "Income",
        data: data.incomePerMonth.data.map((item: { totalIncome: string; }) => item.totalIncome),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
  };

  return (
  <div className="w-full">
    <Bar data={incomeData} options={options} />;
  </div>)
};
