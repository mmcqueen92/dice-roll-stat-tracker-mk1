import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import RollDistributionProps from "../Interfaces/RollDistributionProps";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RollDistributionChart({
  data,
  title,
}: RollDistributionProps) {
  // Extracting keys and values from the data object
  const labels = Object.keys(data).map((key) => parseInt(key)); // x-axis (1, 2, 3, ...)
  const values = Object.values(data); // y-axis (frequency of rolls)

  // Set up chart data
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title, // Title for the chart
        data: values,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  // Set up chart options
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
}
