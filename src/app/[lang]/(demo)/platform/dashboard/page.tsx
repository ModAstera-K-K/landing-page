import React from "react";
import PlatformNavigation from "@/components/PlatformNavigation";
import Link from "next/link";
// Sample data object for datasets and models
const data = {
  datasets: [
    { name: "Chest X-Ray Data", size: "6.3 GB", lastUpdated: "2024-10-29" },
    { name: "Patient Vitals Data", size: "0.5GB", lastUpdated: "2024-10-15" },
  ],
  models: [
    {
      name: "Pneumonia Predictor v1",
      status: "Trained",
      accuracy: "87.53%",
      lastUpdated: "2024-10-30",
    },
    {
      name: "Sepsis Early Detection",
      status: "Trained",
      accuracy: "89.22%",
      lastUpdated: "2024-10-15",
    },
    {
      name: "Pneumonia Predictor v2",
      status: "Evaluating",
      accuracy: "-",
      lastUpdated: "2024-11-02",
    },
    {
      name: "Sleep Apnea Detection",
      status: "Training",
      accuracy: "-",
      lastUpdated: "2024-11-03",
    },
    {
      name: "Sepsis Early Detection 2",
      status: "Training",
      accuracy: "-",
      lastUpdated: "2024-11-04",
    },
  ],
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Datasets
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data.datasets.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Models
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {data.models.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Active Jobs
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            3
          </p>{" "}
          {/* This would come from a job tracking source */}
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-6">
        {/* Datasets Table */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Datasets
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-gray-600 dark:text-gray-400">Name</th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">Size</th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {data.datasets.map((dataset, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {dataset.name}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {dataset.size}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {dataset.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Link
            href="/platform/dataset"
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Upload New Dataset
          </Link>
        </div>

        {/* Models Table */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Models
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-gray-600 dark:text-gray-400">Name</th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Accuracy
                </th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {data.models.map((model, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {model.name}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {model.status}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {model.accuracy}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {model.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link
            href="/platform/dataset"
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Train New Model
          </Link>
        </div>
      </div>
    </div>
  );
}
