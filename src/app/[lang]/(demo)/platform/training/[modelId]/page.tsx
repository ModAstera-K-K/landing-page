"use client";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Link from "next/link";
import PlatformNavigation from "@/components/PlatformNavigation";
import { useTheme } from "next-themes";
import modelsData from "@/app/[lang]/(demo)/platform/modelsData";

// Reusing the metrics and training steps from training-full page
const metrics = [
  { metric: "Accuracy", value: `${(Math.random() * (89 - 86) + 86).toFixed(2)}%` },
  { metric: "F1 Score", value: "0.889" },
  { metric: "True Positive Rate", value: "0.895" },
  { metric: "True Negative Rate", value: "0.901" },
  { metric: "False Positive Rate", value: "0.105" },
  { metric: "False Negative Rate", value: "0.009" },
];

const trainingSteps = [
  { step: "Preprocessing", completed: true },
  { step: "ML Pipeline Creation", completed: true },
  { step: "Model Candidates Training", completed: true },
  { step: "Model Candidates Evaluation", completed: true },
  { step: "Final Model Selection", completed: true },
];

// Add these constants at the top with other constants
const PREPROCESSING_PROGRESS = 20;
const PIPELINE_CREATION_PROGRESS = 40;
const TRAINING_START_PROGRESS = 40;
const TRAINING_END_PROGRESS = 80;
const EVALUATION_PROGRESS = 90;
const FINAL_SELECTION_PROGRESS = 100;

export default function ModelTrainingDetail({ params }: { params: { modelId: string }}) {
  const [showDetails, setShowDetails] = useState(false);
  const { theme } = useTheme();
  const [model, setModel] = useState(() => 
    modelsData.find(m => m.name.toLowerCase().replace(/\s+/g, '-') === params.modelId)
  );
  
  // Force re-render every 50ms to update progress
  const [, setForceUpdate] = React.useState({});
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setForceUpdate({});
      setModel(modelsData.find(m => m.name.toLowerCase().replace(/\s+/g, '-') === params.modelId));
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [params.modelId]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Chart data that updates based on training progress
  const chartData = {
    labels: [20, 40, 60, 80, 100, 120, 140],
    datasets: [
      {
        label: "Training",
        data: Array(7).fill(null).map((_, i) => {
          if (!model?.progress) return null;
          if (model.progress < TRAINING_START_PROGRESS) return null;
          if (model.progress > TRAINING_END_PROGRESS) return [20, 50, 60, 70, 85, 88, 89.22][i];
          
          // Calculate progress within training phase
          const trainingProgress = (model.progress - TRAINING_START_PROGRESS) / 
            (TRAINING_END_PROGRESS - TRAINING_START_PROGRESS);
          const pointThreshold = i / 6;
          
          return trainingProgress >= pointThreshold ? [20, 50, 60, 70, 85, 88, 89.22][i] : null;
        }),
        borderColor: "#2563eb",
        fill: false,
        spanGaps: true,
      },
      {
        label: "Validation",
        data: Array(7).fill(null).map((_, i) => {
          if (!model?.progress) return null;
          if (model.progress < TRAINING_START_PROGRESS) return null;
          if (model.progress > TRAINING_END_PROGRESS) return [1, 30, 55, 65, 80, 83.5, 84][i];
          
          // Calculate progress within training phase
          const trainingProgress = (model.progress - TRAINING_START_PROGRESS) / 
            (TRAINING_END_PROGRESS - TRAINING_START_PROGRESS);
          const pointThreshold = i / 6;
          
          return trainingProgress >= pointThreshold ? [1, 30, 55, 65, 80, 83.5, 84][i] : null;
        }),
        borderColor: "#f97316",
        fill: false,
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 0
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: theme === 'dark' ? '#4b5563' : undefined,
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : undefined,
          callback: function (value: number | string): string {
            return value + "%";
          },
        },
        border: {
          color: theme === 'dark' ? '#6b7280' : undefined
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? '#4b5563' : undefined,
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

  if (!model) {
    return <div>Model not found</div>;
  }

  // Calculate completed steps based on specific progress thresholds
  const getCompletedSteps = (progress: number | undefined) => {
    if (!progress) return 0;
    if (progress >= FINAL_SELECTION_PROGRESS) return 5;
    if (progress >= EVALUATION_PROGRESS) return 4;
    if (progress >= TRAINING_END_PROGRESS) return 3;
    if (progress >= PIPELINE_CREATION_PROGRESS) return 2;
    if (progress >= PREPROCESSING_PROGRESS) return 1;
    return 0;
  };

  // Update the completedSteps calculation
  const completedSteps = getCompletedSteps(model.progress);
  const updatedTrainingSteps = trainingSteps.map((step, index) => ({
    ...step,
    completed: index < completedSteps
  }));

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      {/* Training Progress */}
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <svg
              onClick={toggleDetails}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8 text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200" style={{ whiteSpace: "nowrap" }}>
              {model.name} - {model.status}
            </h2>
          </div>
          <div className="mx-4 h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-4 rounded-full transition-all duration-200 ${model.color}`}
              style={{ width: `${model.progress}%` }}
            ></div>
          </div>
          <div className="font-semibold text-gray-700 dark:text-gray-300" style={{ whiteSpace: "nowrap" }}>
            {Math.round(model?.progress ?? 0)}% Complete
          </div>
        </div>

        {showDetails && (
          <div className="space-y-4 mt-4">
            {updatedTrainingSteps.map((step, index) => (
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
            {model?.progress === 100 && (
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
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Training / Validation Accuracy
          </h3>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Metrics Result
          </h3>
          {model.progress === 100 ? (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">Metric</th>
                  <th className="pb-2 text-gray-600 dark:text-gray-400">Value</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => (
                  <tr key={index} className="border-t border-gray-300 dark:border-gray-600">
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
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Metrics will be available once training is complete.
            </p>
          )}
          
          <div className="my-4"></div>
          
          {model.progress === 100 && (
            <Link
              href="/platform/deployment"
              className="mt-4 rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Deploy Model
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 