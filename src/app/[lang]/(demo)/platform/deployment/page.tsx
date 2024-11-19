"use client";

import React from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import PlatformNavigation from "@/components/PlatformNavigation";
import Link from "next/link";

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

// Chart options
const performanceOptions = {
  responsive: true,
  scales: {
    y1: {
      type: "linear" as const,
      position: "left" as const,
      beginAtZero: true,
      max: 100,
    },
    y2: {
      type: "linear" as const,
      position: "right" as const,
      beginAtZero: true,
      suggestedMax: 100,
    },
  },
};

export default function DeploymentDashboard() {
  const performanceData = {
    labels: data.performance.labels,
    datasets: [
      {
        label: "Accuracy",
        data: data.performance.accuracy,
        borderColor: "#2563eb",
        fill: false,
        yAxisID: "y1",
      },
      {
        label: "Latency (ms)",
        data: data.performance.latency,
        borderColor: "#f87171",
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
        backgroundColor: "#1f2937",
      },
    ],
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-8">
      <PlatformNavigation />
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <h3 className="text-sm font-semibold text-gray-600">
            Total API Calls (Last 7 Days)
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {data.metrics.apiCalls}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <h3 className="text-sm font-semibold text-gray-600">
            Average Accuracy
          </h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {data.metrics.averageAccuracy}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <h3 className="text-sm font-semibold text-gray-600">Active Models</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">
            {data.metrics.activeModels}
          </p>
        </div>
      </div>
      {/* Deployed Models Table */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Deployed Models</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2 text-gray-600">Name</th>
              <th className="pb-2 text-gray-600">Status</th>
              <th className="pb-2 text-gray-600">Version</th>
              <th className="pb-2 text-gray-600">Deployed</th>
              <th className="pb-2 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.models.map((model, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">{model.name}</td>
                <td className="py-2">
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-medium ${
                      model.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {model.status}
                  </span>
                </td>
                <td className="py-2">{model.version}</td>
                <td className="py-2">{model.deployedDate}</td>
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
                    <button className="rounded border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-50">
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
          className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Deploy New Model
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Model Performance Chart */}
        <div className="max-h-[512px]rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Model Performance</h3>
          <Line data={performanceData} options={performanceOptions} />
        </div>

        {/* API Usage Chart */}
        <div className="max-h-[512px] rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">API Usage</h3>
          <Bar
            data={apiUsageData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}
