"use client";

import React from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import PlatformNavigation from "@/components/PlatformNavigation";
import Link from "next/link";
import { useTheme } from "next-themes";

// Sample data object
const data = {
  models: [
    {
      name: "Sepsis Early Detection",
      status: "Active",
      version: "89.22%",
      deployedDate: "2024-10-15",
      isChecked: true,
    },
    {
      name: "Pneumonia Predictor v1",
      status: "Inactive",
      version: "87.53%",
      deployedDate: "2024-10-30",
      isChecked: false,
    },
  ],
  metrics: {
    apiCalls: 10256,
    averageAccuracy: "89.22%",
    activeModels: 1,
  },
  performance: {
    labels: ["2024-10-01", "2024-10-03", "2024-10-05", "2024-10-07"],
    accuracy: [75, 78, 80, 82],
    latency: [90, 100, 95, 110],
  },
  apiUsage: {
    labels: ["2024-10-01", "2024-10-03", "2024-10-05", "2024-10-07"],
    calls: [100, 150, 225, 300],
  },
};

export default function DeploymentDashboard() {
  const { theme } = useTheme();

  const performanceOptions = {
    responsive: true,
    scales: {
      y1: {
        type: "linear" as const,
        position: "left" as const,
        beginAtZero: true,
        max: 100,
        grid: {
          color: theme === 'dark' ? '#4b5563' : undefined,
          borderColor: theme === 'dark' ? '#6b7280' : undefined
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : undefined
        },
        border: {
          color: theme === 'dark' ? '#6b7280' : undefined
        }
      },
      y2: {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        suggestedMax: 100,
        grid: {
          color: theme === 'dark' ? '#4b5563' : undefined,
          borderColor: theme === 'dark' ? '#6b7280' : undefined
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : undefined
        },
        border: {
          color: theme === 'dark' ? '#6b7280' : undefined
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? '#4b5563' : undefined,
          borderColor: theme === 'dark' ? '#6b7280' : undefined
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : undefined
        },
        border: {
          color: theme === 'dark' ? '#6b7280' : undefined
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : undefined
        }
      }
    }
  };

  const performanceData = {
    labels: data.performance.labels,
    datasets: [
      {
        label: "Accuracy",
        data: data.performance.accuracy,
        borderColor: theme === 'dark' ? '#60a5fa' : '#2563eb', // brighter blue in dark mode
        fill: false,
        yAxisID: "y1",
      },
      {
        label: "Latency (ms)",
        data: data.performance.latency,
        borderColor: theme === 'dark' ? '#f87171' : '#f87171', // keep same red color
        fill: false,
        yAxisID: "y2",
      },
    ],
  };

  const apiUsageData = {
    labels: data.apiUsage.labels,
    datasets: [
      {
        label: "API Calls",
        data: data.apiUsage.calls,
        backgroundColor: theme === 'dark' ? '#60a5fa' : '#1f2937', // blue-400 for dark mode
        borderColor: theme === 'dark' ? '#3b82f6' : '#1f2937', // blue-500 for dark mode
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Total API Calls (Last 7 Days)
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
            {data.metrics.apiCalls}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Average Accuracy
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
            {data.metrics.averageAccuracy}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Active Models
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
            {data.metrics.activeModels}
          </p>
        </div>
      </div>
      {/* Deployed Models Table */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Deployed Models
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2 text-gray-600 dark:text-gray-400">Name</th>
              <th className="pb-2 text-gray-600 dark:text-gray-400">Status</th>
              <th className="pb-2 text-gray-600 dark:text-gray-400">Version</th>
              <th className="pb-2 text-gray-600 dark:text-gray-400">
                Deployed
              </th>
              <th className="pb-2 text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.models.map((model, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 dark:border-gray-600"
              >
                <td className="py-2 text-gray-800 dark:text-gray-200">
                  {model.name}
                </td>
                <td className="py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-medium ${
                      model.status === "Active"
                        ? "bg-green-100 text-green-600 dark:bg-green-200 dark:text-green-800"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {model.status}
                  </span>
                </td>
                <td className="py-2 text-gray-800 dark:text-gray-200">
                  {model.version}
                </td>
                <td className="py-2 text-gray-800 dark:text-gray-200">
                  {model.deployedDate}
                </td>
                <td className="py-2">
                  <div className="flex items-center space-x-2">
                    <label className="sr-only">
                      Toggle {model.name} status
                      <input
                        type="checkbox"
                        className="toggle-checkbox"
                        defaultChecked={model.isChecked}
                      />
                    </label>
                    <button className="rounded border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900">
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link
          href="/platform/dataset"
          className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Deploy New Model
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Model Performance Chart */}
        <div className="max-h-[512px] rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Model Performance
          </h3>
          <Line data={performanceData} options={performanceOptions} />
        </div>

        {/* API Usage Chart */}
        <div className="max-h-[512px] rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            API Usage
          </h3>
          <Bar
            data={apiUsageData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                x: {
                  grid: {
                    display: false,
                    color: theme === 'dark' ? '#4b5563' : undefined, // gray-600
                    borderColor: theme === 'dark' ? '#6b7280' : undefined // gray-500
                  },
                  ticks: {
                    color: theme === 'dark' ? '#e5e7eb' : undefined // gray-200
                  },
                  border: {
                    color: theme === 'dark' ? '#6b7280' : undefined // gray-500
                  }
                },
                y: {
                  grid: {
                    color: theme === 'dark' ? '#4b5563' : undefined, // gray-600
                    borderColor: theme === 'dark' ? '#6b7280' : undefined // gray-500
                  },
                  ticks: {
                    color: theme === 'dark' ? '#e5e7eb' : undefined // gray-200
                  },
                  border: {
                    color: theme === 'dark' ? '#6b7280' : undefined // gray-500
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: theme === 'dark' ? '#e5e7eb' : undefined // gray-200
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
