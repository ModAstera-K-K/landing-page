"use client";
import React from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

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
  labels: [1, 2, 3, 4, 5, 6, 7],
  datasets: [
    {
      label: "Accuracy",
      data: [20, 50, 60, 70, 85, 88, 89.22],
      borderColor: "#2563eb",
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
        callback: function(this: any, value: number | string, index: number, ticks: any[]): string {
          return value + "%";
        },
      },
    },
  },
};

export default function TrainingDetail() {
  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-8">
      {/* Training Progress */}
      <Link
        href="/platform/training-full"
        className="flex items-center justify-between rounded-lg bg-white p-6 shadow"
      >
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">
            Sepsis Early Detection - Trained
          </h2>
        </div>
        <div className="mx-4 h-4 w-full rounded-full bg-gray-200">
          <div
            className="h-4 rounded-full bg-green-500"
            style={{ width: "100%" }}
          ></div>
        </div>
        <div className="font-semibold text-gray-700">100% Complete</div>
      </Link>

      <div className="grid grid-cols-2 gap-6">
        {/* Training & Validation Accuracy Charts */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Training</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Validation</h3>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Metrics Result Table */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Metrics Result</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-gray-600">Metric</th>
                <th className="pb-2 text-gray-600">Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{metric.metric}</td>
                  <td className="py-2">{metric.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Deploy Model
          </button>
        </div>
      </div>
    </div>
  );
}
