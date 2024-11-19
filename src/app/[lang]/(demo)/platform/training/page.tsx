import React from "react";
import Link from "next/link";
import PlatformNavigation from "@/components/PlatformNavigation";

// Sample data object for models with training progress
const data = {
  models: [
    {
      name: "Sepsis Early Detection 2",
      status: "Training",
      progress: 78,
      color: "bg-blue-500",
    },
    {
      name: "Sleep Apnea Detection",
      status: "Training",
      progress: 67,
      color: "bg-blue-500",
    },
    {
      name: "Pneumonia Predictor V2",
      status: "Evaluating",
      progress: 80,
      color: "bg-yellow-500",
    },
    {
      name: "Pneumonia Predictor V2",
      status: "Trained",
      progress: 100,
      color: "bg-green-500",
    },
    {
      name: "Sepsis Early Detection",
      status: "Trained",
      progress: 100,
      color: "bg-green-500",
    },
  ],
};

export default function Training() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />

      {/* Training Progress */}
      <div className="space-y-6">
        {data.models.map((model, index) => (
          <Link
            key={index}
            href="/platform/training-detail"
            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            {/* Model Information */}
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
                {model.name} - {model.status}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="mx-4 flex-grow">
              <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`${model.color} h-4 rounded-full`}
                  style={{ width: `${model.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Completion Percentage */}
            <div className="font-semibold text-gray-700 dark:text-gray-300">
              {model.progress}% Complete
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
