import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import PieChartProps from "../Interfaces/RollTypeRatesPieChartProps";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function RollTypeRatesPieChart({ data, title }: PieChartProps) {
  if (!data) {
    return null;
  }

  const labels = [
    "Attack",
    "Ability/Skill Check",
    "Saving Throw",
    "Attack/Spell Damage",
  ];
  const values = Object.values(data).map((value) => value * 100);

  const chartData = {
    labels: labels, 
    datasets: [
      {
        label: title, 
        data: values,
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

  const chartOptions = {
    plugins: {
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return <Pie data={chartData} options={chartOptions} />;
}
