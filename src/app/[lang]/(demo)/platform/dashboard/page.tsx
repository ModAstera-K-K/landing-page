"use client";

import React, { useState, useEffect } from "react";
import PlatformNavigation from "@/components/PlatformNavigation";
import Link from "next/link";
import modelsData from "@/app/[lang]/(demo)/platform/modelsData"; // Import the shared models data
import datasetsData from "@/app/[lang]/(demo)/platform/datasetsData"; // Import the datasets data
import { startModelTraining } from "@/app/[lang]/(demo)/platform/modelsData"; // Import the shared models data

export default function Dashboard() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const [trainingInstructions, setTrainingInstructions] = useState("");
  const [evaluationMetric, setEvaluationMetric] = useState("Auto");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isTrainingModel, setIsTrainingModel] = useState(false); // New state to track if training model block is shown
  const [modelName, setModelName] = useState(""); // Add new state for model name
  const [forceUpdate, setForceUpdate] = useState({}); // Add new state to force re-render

  const handleUploadClick = () => {
    setShowUploadForm(true);
    setIsTrainingModel(false); // Reset training model state
  };

  const handleContinueClick = () => {
    // Check if a file is uploaded and a dataset name is provided
    if (!uploadedFile || !datasetName) {
        return; // Do nothing if conditions are not met
    }
    
    setShowUploadForm(false);
    // Reset the form fields if needed
    setDatasetName("");
    setTrainingInstructions("");
    setEvaluationMetric("Auto");
    setUploadedFile(null);

    // Append new dataset to datasetsData at the top
    const newDataset = {
        name: datasetName,
        size: `${(Math.random() * 9 + 1).toFixed(1)} GB`, // Random size between 1-10 GB
        lastUpdated: new Date().toISOString().split('T')[0], // Current date
        annotationPath: "/platform/dashboard"
    };
    datasetsData.unshift(newDataset); // Update datasetsData to add at the top
    // Trigger a re-render or state update if necessary
  };

  // Update the datasets display to reflect the new data
  useEffect(() => {
    // This will ensure the component re-renders when datasetsData changes
  }, [datasetsData]);

  // New function to handle training model click
  const handleTrainModelClick = () => {
    setIsTrainingModel(true);
    setShowUploadForm(false); // Hide upload form
  };

  // New function to handle cancel action
  const handleCancelClick = () => {
    setIsTrainingModel(false); // Go back to models view
  };

  const handleTrainModelContinue = () => {
    if (!modelName.trim() || !trainingInstructions.trim()) {
      return;
    }
    
    const newModel = {
      name: modelName,
      status: "Training",
      accuracy: "-",
      lastUpdated: new Date().toISOString().split('T')[0],
      progress: 0,
      color: "bg-blue-500",
      link: "/platform/training"
    };
    
    modelsData.unshift(newModel);
    startModelTraining(newModel); // Start training immediately
    
    setModelName("");
    setTrainingInstructions("");
    setEvaluationMetric("Auto");
    setIsTrainingModel(false);
  };

  // Add this effect to watch for model updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Force re-render to reflect model updates
      setForceUpdate({});
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

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
            {datasetsData.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Total Models
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {modelsData.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Active Jobs
          </h2>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            3
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Conditional rendering for Upload Dataset Form */}
        {showUploadForm ? (
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
            <Link
              href="#"
              onClick={handleContinueClick}
              className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Continue
            </Link>
            <Link
              href="#"
              onClick={() => setShowUploadForm(false)}
              className="mt-4 ml-2 rounded bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
            >
              Cancel
            </Link>
          </div>
        ) : (
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
                  <th className="pb-2 text-gray-600 dark:text-gray-400">Annotations</th> {/* Updated column name */}
                </tr>
              </thead>
              <tbody>
                {datasetsData.map((dataset, index) => (
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
                    <td className="py-2 text-gray-800 dark:text-gray-200">
                      <Link
                        href={dataset.annotationPath || '#'}
                        className="rounded border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mb-4" />
            <Link
              href="#"
              onClick={handleUploadClick}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Upload New Dataset
            </Link>
          </div>
        )}
        
        {isTrainingModel ? ( // Conditional rendering for Train Model block
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Train New Model
            </h2>
            <div className="mb-4">
              <label className="mb-2 block text-gray-600 dark:text-gray-400">
                Select Dataset
              </label>
              <select className="w-full rounded border border-gray-300 bg-white p-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                {datasetsData.map((dataset, index) => (
                  <option key={index} value={dataset.name}>
                    {dataset.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-gray-600 dark:text-gray-400">
                Model Name
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Enter a name for your model"
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
            
            <div className="flex justify-start">
              <Link
                href="#"
                onClick={handleTrainModelContinue}
                className="mt-4 mr-2 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Continue
              </Link>
              <Link
                href="#"
                onClick={handleCancelClick}
                className="mt-4 rounded bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
              >
                Cancel
              </Link>
            </div>
          </div>
        ) : (
          // Existing Models Table rendering
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Models
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">Name</th>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">Status</th>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">Accuracy</th>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {modelsData.map((model, index) => (
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
            <div className="mb-4" />
            <Link
              href="#"
              onClick={handleTrainModelClick} // Update to handle training model click
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Train New Model
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
