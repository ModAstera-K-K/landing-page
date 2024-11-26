"use client";

import React from "react";
import Link from "next/link";
import PlatformNavigation from "@/components/PlatformNavigation";
import modelsData from "@/app/[lang]/(demo)/platform/modelsData";

export default function Training() {
  const [modelProgress, setModelProgress] = React.useState<{ [key: string]: number }>({});
  const [modelColors, setModelColors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    modelsData.forEach((model) => {
      if (model.progress === 0 && !modelProgress[model.name]) {
        const startTime = Date.now();
        const duration = 10000; // 10 seconds

        const intervalId = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / duration) * 100, 100);
          
          setModelProgress(prev => ({
            ...prev,
            [model.name]: progress
          }));

          // Update status and color based on progress
          if (progress >= 80 && progress < 100) {
            model.status = "Evaluating";
            setModelColors(prev => ({
              ...prev,
              [model.name]: "bg-yellow-500" // Yellow color for evaluating
            }));
          } else if (progress === 100) {
            clearInterval(intervalId);
            model.progress = 100;
            model.status = "Trained";
            setModelColors(prev => ({
              ...prev,
              [model.name]: "bg-green-500" // Green color for trained
            }));
          } else {
            model.status = "Training";
            setModelColors(prev => ({
              ...prev,
              [model.name]: "bg-blue-500" // Blue color for training
            }));
          }

        }, 50); // Update every 50ms for smooth animation

        return () => clearInterval(intervalId);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />

      {/* Training Progress */}
      <div className="space-y-6">
        {modelsData.map((model, index) => (
          <Link
            key={index}
            href={model.link}
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
                  className={`${modelColors[model.name] || model.color} h-4 rounded-full transition-all duration-200`}
                  style={{ width: `${modelProgress[model.name] ?? model.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Completion Percentage */}
            <div className="font-semibold text-gray-700 dark:text-gray-300">
              {Math.round(modelProgress[model.name] ?? model.progress)}% Complete
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
