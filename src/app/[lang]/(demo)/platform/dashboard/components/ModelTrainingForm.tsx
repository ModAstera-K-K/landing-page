import React from "react";
import Link from "next/link";
import { Dataset } from "../types";

interface ModelTrainingFormProps {
  datasets: Dataset[];
  modelName: string;
  setModelName: (name: string) => void;
  trainingInstructions: string;
  setTrainingInstructions: (instructions: string) => void;
  evaluationMetric: string;
  setEvaluationMetric: (metric: string) => void;
  onContinue: () => void;
  onCancel: () => void;
}

export const ModelTrainingForm = ({
  datasets,
  modelName,
  setModelName,
  trainingInstructions,
  setTrainingInstructions,
  evaluationMetric,
  setEvaluationMetric,
  onContinue,
  onCancel,
}: ModelTrainingFormProps) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Train New Model
      </h2>
      <div className="mb-4">
        <label className="mb-2 block text-gray-600 dark:text-gray-400">
          Select Dataset
        </label>
        <select
          aria-label="Select Dataset"
          className="w-full rounded border border-gray-300 bg-white p-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        >
          {datasets.map((dataset) => (
            <option key={dataset.id} value={dataset.id}>
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
          Manually select the evaluation metrics or let AI automatically choose
          for you.
        </p>
      </div>

      <div className="flex justify-start">
        <Link
          href="#"
          onClick={onContinue}
          className="mr-2 mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Continue
        </Link>
        <Link
          href="#"
          onClick={onCancel}
          className="mt-4 rounded bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};
