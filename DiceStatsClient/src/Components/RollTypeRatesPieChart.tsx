import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import PieChartProps from "../Interfaces/RollTypeRatesPieChartProps";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function RollTypeRatesPieChart({ data, title }: PieChartProps) {
  if (!data) {
    return null;
  }
  // Extracting labels and values from the data object
  const labels = Object.keys(data); // ["attack", "skillCheck", "savingThrow", "attackOrSpellDamage"]
  const values = Object.values(data).map((value) => value * 100); // Convert fractions to percentages

  // Set up chart data
  const chartData = {
    labels: labels, // Use the keys as labels
    datasets: [
      {
        label: title, // Optional title
        data: values, // Values as percentages
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Set up chart options
  const chartOptions = {
    plugins: {
      title: {
        display: !!title, // Display title if provided
        text: title,
      },
    },
  };

  return <Pie data={chartData} options={chartOptions} />;
}
