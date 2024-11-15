"use client";

import React, { useState } from "react";
import PlatformNavigation from "@/components/PlatformNavigation";

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PlatformNavigation />
      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-800">
            Total Datasets
          </h2>
          <p className="text-3xl font-bold">1</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-800">Total Models</h2>
          <p className="text-3xl font-bold">{data.models.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-800">Active Jobs</h2>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Upload Dataset Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Upload Dataset</h2>
          <div className="mb-4 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="mb-2 h-12 w-12 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-gray-600">Drag and drop your dataset here</p>
            <p className="mt-2 text-sm text-gray-400">
              or click to select files (images, CSV, JSON)
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-gray-600">Dataset Name</label>
            <input
              type="text"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              placeholder="Enter a name for your dataset"
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-gray-600">
              Training Instructions
            </label>
            <textarea
              value={trainingInstructions}
              onChange={(e) => setTrainingInstructions(e.target.value)}
              placeholder="Provide detailed instructions for training your model"
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-gray-600">
              Evaluation Metrics
            </label>
            <select
              value={evaluationMetric}
              onChange={(e) => setEvaluationMetric(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
            >
              <option>Auto</option>
              <option>Accuracy</option>
              <option>Precision</option>
              <option>Recall</option>
            </select>
            <p className="mt-2 text-sm text-gray-400">
              Manually select the evaluation metrics or let AI automatically
              choose for you.
            </p>
          </div>

          <button className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Continue
          </button>
        </div>

        {/* Models Table */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Models</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-gray-600">Name</th>
                <th className="pb-2 text-gray-600">Status</th>
                <th className="pb-2 text-gray-600">Accuracy</th>
                <th className="pb-2 text-gray-600">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {data.models.map((model, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">{model.name}</td>
                  <td className="py-2">{model.status}</td>
                  <td className="py-2">{model.accuracy}</td>
                  <td className="py-2">{model.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Train New Model
          </button>
        </div>
      </div>
    </div>
  );
}
