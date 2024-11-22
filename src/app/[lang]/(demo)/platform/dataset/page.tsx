"use client";

import React, { useState } from "react";
import PlatformNavigation from "@/components/PlatformNavigation";
import Link from "next/link";

// Sample data object for models
const data = {
  models: [
    {
      name: "Sepsis Early Detection 2",
      status: "Training",
      accuracy: "-",
      lastUpdated: "2024-11-04",
    },
    {
      name: "Sleep Apnea Detection",
      status: "Training",
      accuracy: "-",
      lastUpdated: "2024-11-03",
    },
    {
      name: "Pneumonia Predictor v2",
      status: "Evaluating",
      accuracy: "-",
      lastUpdated: "2024-11-02",
    },
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
  ],
};

export default function Dashboard() {
  // State for form fields
  const [datasetName, setDatasetName] = useState("");
  const [trainingInstructions, setTrainingInstructions] = useState("");
  const [evaluationMetric, setEvaluationMetric] = useState("Auto");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Datasets
          </h2>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            1
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Models
          </h2>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {data.models.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Active Jobs
          </h2>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            3
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Upload Dataset Form */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Upload Dataset
          </h2>
          <div
            className="mb-4 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 p-8 dark:border-gray-600"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const files = Array.from(e.dataTransfer.files);
              if (files.length > 0) {
                setUploadedFile(files[0].name); // Set the uploaded file name
              }
            }}
          >
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  setUploadedFile(files[0].name); // Set the uploaded file name
                }
              }}
            />
            {uploadedFile ? (
              <div className="flex items-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Uploaded File: {uploadedFile}
                </p>
                <div
                  onClick={() => setUploadedFile(null)}
                  className="ml-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="red"
                    className="h-5 w-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="mb-2 h-12 w-12 text-gray-400 dark:text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag and drop your dataset here
                </p>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                  or click the plus icon to select files (images, CSV, JSON)
                </p>
              </>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-gray-600 dark:text-gray-400">
              Dataset Name
            </label>
            <input
              type="text"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              placeholder="Enter a name for your dataset"
              className="w-full rounded border border-gray-300 bg-white p-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-gray-600 dark:text-gray-400">
              Training Instructions
            </label>
            <textarea
              value={trainingInstructions}
              onChange={(e) => setTrainingInstructions(e.target.value)}
              placeholder="Provide detailed instructions for training your model"
              className="w-full rounded border border-gray-300 bg-white p-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="evalMetric"
              className="mb-2 block text-gray-600 dark:text-gray-400"
            >
              Evaluation Metrics
            </label>
            <select
              id="evalMetric"
              value={evaluationMetric}
              onChange={(e) => setEvaluationMetric(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white p-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              <option>Auto</option>
              <option>Accuracy</option>
              <option>Precision</option>
              <option>Recall</option>
            </select>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
              Manually select the evaluation metrics or let AI automatically
              choose for you.
            </p>
          </div>

          <Link
            href="/platform/dashboard"
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Continue
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
                  className="border-t border-gray-300 dark:border-gray-600"
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
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Train New Model
          </Link>
        </div>
      </div>
    </div>
  );
}
