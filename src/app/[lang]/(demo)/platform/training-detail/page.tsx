"use client";
import React from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import PlatformNavigation from "@/components/PlatformNavigation";

// Sample data for metrics and chart
const metrics = [
  { metric: "Accuracy", value: "89.22%" },
  { metric: "F1 Score", value: "0.889" },
  { metric: "True Positive Rate", value: "0.895" },
  { metric: "True Negative Rate", value: "0.901" },
  { metric: "False Positive Rate", value: "0.105" },
  { metric: "False Negative Rate", value: "0.009" },
];

// Sample data for line chart
const chartData = {
  labels: [20, 40, 60, 80, 100, 120, 140],
  datasets: [
    {
      label: "Training",
      data: [20, 50, 60, 70, 85, 88, 89.22],
      borderColor: "#2563eb",
      fill: false,
    },
    {
      label: "Validation",
      data: [15, 45, 55, 65, 80, 83.5, 84],
      borderColor: "#f97316",
      fill: false,
    },
  ],
};

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function (
          this: any,
          value: number | string,
          index: number,
          ticks: any[],
        ): string {
          return value + "%";
        },
      },
    },
  },
};

export default function TrainingDetail() {
  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      {/* Training Progress */}
      <Link
        href="/platform/training-full"
        className="flex items-center justify-between rounded-lg bg-white p-6 shadow dark:bg-gray-800"
      >
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 text-gray-800 dark:text-gray-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200" style={{ whiteSpace: 'nowrap' }}>
            Sepsis Early Detection - Trained
          </h2>
        </div>
        <div className="mx-4 h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-4 rounded-full bg-green-500"
            style={{ width: "100%" }}
          ></div>
        </div>
        <div className="font-semibold text-gray-700 dark:text-gray-300" style={{ whiteSpace: 'nowrap' }}>
          100% Complete
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-6">
        {/* Training & Validation Accuracy Charts */}
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Training / Validation Accuracy
          </h3>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Metrics Result Table - Moved to the right */}
        <div className="col-span-1 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Metrics Result
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Metric
                </th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-300 dark:border-gray-600"
                >
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {metric.metric}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {metric.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-4"></div>
          <Link
            href="/platform/deployment"
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Deploy Model
          </Link>
        </div>
      </div>
    </div>
  );
}
