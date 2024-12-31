import { useEffect, useState } from "react";
import modelsData from "@/app/[lang]/(demo)/platform/modelsData";

export function StatsSection() {
  const [datasetsCount, setDatasetsCount] = useState(0);
  const modelsCount = modelsData.length;
  const activeJobs = 3;

  useEffect(() => {
    const fetchDatasetsCount = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/datasets/`,
        );
        const data = await response.json();
        setDatasetsCount(data.length);
      } catch (error) {
        console.error("Error fetching datasets:", error);
        setDatasetsCount(0);
      }
    };

    fetchDatasetsCount();
  }, []);

  return (
    <div className="mb-8 grid grid-cols-3 gap-6">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Total Datasets
        </h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {datasetsCount}
        </p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Total Models
        </h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {modelsCount}
        </p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Active Jobs
        </h2>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {activeJobs}
        </p>
      </div>
    </div>
  );
}
