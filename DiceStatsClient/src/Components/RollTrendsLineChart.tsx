import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import LineChartProps from "../Interfaces/RollTrendsLineChartProps";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function RollTrendsLineChart({ data, title }: LineChartProps) {
  // Extracting keys and values from the data object
  const labels = Object.keys(data).map((key) => parseInt(key)); // x-axis (1, 2, 3, ...)
  const values = Object.values(data); // y-axis (18, 16.5, 12.66, ...)

  // Set up chart data
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        // fill: true,
        tension: 0.3, // For smooth curves, adjust this value as needed
      },
    ],
  };

  // Set up chart options
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        min: 1, // Setting y-axis minimum to 1
        max: 20, // Setting y-axis maximum to 20
      },
      x: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}