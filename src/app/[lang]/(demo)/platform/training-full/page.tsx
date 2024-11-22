"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Link from "next/link";
import PlatformNavigation from "@/components/PlatformNavigation";

// Sample data for metrics and chart
const metrics = [
  { metric: "Accuracy", value: "89.22%" },
  { metric: "F1 Score", value: "0.889" },
  { metric: "True Positive Rate", value: "0.895" },
  { metric: "True Negative Rate", value: "0.901" },
];

const trainingSteps = [
  { step: "Preprocessing", completed: true },
  { step: "ML Pipeline Creation", completed: true },
  { step: "Model Candidates Training", completed: true },
  { step: "Model Candidates Evaluation", completed: true },
  { step: "Final Model Selection", completed: true },
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
        callback: function (value: number | string): string {
          return value + "%";
        },
      },
    },
  },
};

export default function TrainingFullDetail() {
  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      {/* Training Progress */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
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
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Sepsis Early Detection
            </h2>
          </div>
          <div className="mx-4 h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-4 rounded-full bg-green-500"
              style={{ width: "100%" }}
            ></div>
          </div>
          <div className="font-semibold text-gray-700 dark:text-gray-300">
            100% Complete
          </div>
        </div>

        {/* Training Steps Checklist */}
        <div className="space-y-4">
          {trainingSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex h-4 w-4 items-center justify-center">
                {step.completed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={5}
                    stroke="currentColor"
                    className="h-10 w-10 text-green-600 dark:text-green-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                )}
              </div>
              <p className="text-gray-800 dark:text-gray-200">{step.step}</p>
            </div>
          ))}
        </div>

        {/* Advanced View Button */}
        <Link
          href="/platform/training-advanced"
          className="mt-4 flex items-center space-x-1 text-sm font-semibold text-blue-600 dark:text-blue-400"
        >
          Advanced View
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Training Accuracy Chart */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Training
          </h3>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Metrics Result Table */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
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
