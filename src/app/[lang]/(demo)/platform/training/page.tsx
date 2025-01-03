"use client";

import React from "react";
import Link from "next/link";
import PlatformNavigation from "@/components/PlatformNavigation";
import modelsData from "@/app/[lang]/(demo)/platform/modelsData";

export default function Training() {
  // Force re-render every 50ms to update progress
  const [, setForceUpdate] = React.useState({});
  
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setForceUpdate({});
    }, 50);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />

      {/* Training Progress */}
      <div className="space-y-6">
        {modelsData.map((model, index) => (
          <div
            key={index}
            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            {/* Model Information */}
            <div className="flex items-center space-x-4">
              <Link href={`/platform/training/${model.name.toLowerCase().replace(/\s+/g, '-')}`}>
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
              </Link>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {model.name} - {model.status}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="mx-4 flex-grow">
              <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`${model.color} h-4 rounded-full transition-all duration-200`}
                  style={{ width: `${model.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Completion Percentage */}
            <div className="font-semibold text-gray-700 dark:text-gray-300">
              {Math.round(model.progress)}% Complete
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
