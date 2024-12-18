"use client";

import React, { useState, useEffect } from "react";
import PlatformNavigation from "@/components/PlatformNavigation";
import Link from "next/link";
import modelsData from "@/app/[lang]/(demo)/platform/modelsData"; // Import the shared models data
import datasetsData from "@/app/[lang]/(demo)/platform/datasetsData"; // Import the datasets data
import {
  startModelTraining,
  subscribeToModelUpdates,
} from "@/app/[lang]/(demo)/platform/modelsData"; // Import the shared models data
import axios from "axios";

export default function Dashboard() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const [trainingInstructions, setTrainingInstructions] = useState("");
  const [evaluationMetric, setEvaluationMetric] = useState("Auto");
  const [isTrainingModel, setIsTrainingModel] = useState(false); // New state to track if training model block is shown
  const [modelName, setModelName] = useState(""); // Add new state for model name
  const [, forceUpdate] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  // Subscribe to model updates
  useEffect(() => {
    const unsubscribe = subscribeToModelUpdates(() => {
      forceUpdate({});
    });
    return () => unsubscribe();
  }, []);

  const handleUploadClick = () => {
    setShowUploadForm(true);
    setIsTrainingModel(false); // Reset training model state
  };

  const handleContinueClick = () => {
    // Check if a file is uploaded and a dataset name is provided
    if (!filesToUpload || !datasetName) {
      return; // Do nothing if conditions are not met
    }

    setShowUploadForm(false);
    // Reset the form fields if needed
    setDatasetName("");
    setTrainingInstructions("");
    setEvaluationMetric("Auto");
    setFilesToUpload([]);

    // Append new dataset to datasetsData at the top
    const newDataset = {
      name: datasetName,
      size: `${(Math.random() * 9 + 1).toFixed(1)} GB`, // Random size between 1-10 GB
      lastUpdated: new Date().toISOString().split("T")[0], // Current date
      annotationPath: "/platform/dashboard",
    };
    datasetsData.unshift(newDataset); // Update datasetsData to add at the top
    // Trigger a re-render or state update if necessary
  };

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
      lastUpdated: new Date().toISOString().split("T")[0],
      progress: 0,
      color: "bg-blue-500",
      link: "/platform/training",
      trainingInstructions: trainingInstructions,
    };

    modelsData.unshift(newModel);
    startModelTraining(newModel);

    setModelName("");
    setTrainingInstructions("");
    setEvaluationMetric("Auto");
    setIsTrainingModel(false);
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0 || !datasetName) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("dataset_name", datasetName);

    // Append all files
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/upload-images/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        },
      );

      // Handle successful upload
      const newDataset = {
        name: datasetName,
        size: `${(Array.from(files).reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2)} MB`,
        lastUpdated: new Date().toISOString().split("T")[0],
        annotationPath: "/platform/annotation",
      };
      datasetsData.unshift(newDataset);

      // Reset form
      setDatasetName("");
      setFilesToUpload([]);
      setShowUploadForm(false);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload files. Please try again.");
      setIsUploading(false);
    }
  };

  // Update the file drop handler
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    setFilesToUpload(Array.from(files));
  };

  // Update the file input handler
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFilesToUpload(Array.from(files || []));
  };

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
              onDrop={handleFileDrop}
            >
              <input
                id="fileInput"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileInput}
              />
              {filesToUpload.length > 0 ? (
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400">
                      Selected: {filesToUpload[0]?.name}
                    </p>
                    <button
                      onClick={() => setFilesToUpload([])}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                  {isUploading && (
                    <div className="mt-4">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                  {uploadError && (
                    <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                  )}
                </div>
              ) : (
                <>
                  <div
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
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

            <div className="flex space-x-2">
              <button
                onClick={() => handleFileUpload(filesToUpload)}
                disabled={!filesToUpload || !datasetName || isUploading}
                className={`rounded px-4 py-2 font-semibold text-white ${
                  !filesToUpload || !datasetName || isUploading
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setShowUploadForm(false)}
                disabled={isUploading}
                className="rounded bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Datasets
            </h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">
                    Name
                  </th>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">
                    Size
                  </th>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">
                    Last Updated
                  </th>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">
                    Annotations
                  </th>{" "}
                  {/* Updated column name */}
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
                        href={dataset.annotationPath || "#"}
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
                className="mr-2 mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
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
                  <th className="pb-2 text-gray-600 dark:text-gray-400">
                    Name
                  </th>
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
