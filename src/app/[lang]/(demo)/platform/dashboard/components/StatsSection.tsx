import modelsData from "@/app/[lang]/(demo)/platform/modelsData"; // Import the shared models data
import datasetsData from "@/app/[lang]/(demo)/platform/datasetsData";

export function StatsSection() {
  const datasetsCount = datasetsData.length;
  const modelsCount = modelsData.length;
  const activeJobs = 3;
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
