import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Dataset {
  id: string;
  name: string;
  description: string;
  last_modified: string;
  samples: string[];
}

interface DatasetsTableProps {
  onUploadClick: () => void;
}

export const DatasetsTable = ({ onUploadClick }: DatasetsTableProps) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/datasets/`,
          {
            withCredentials: true,
          },
        );
        setDatasets(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch datasets");
        setIsLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">Loading datasets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Datasets
      </h2>
      <div>
        <div className="h-full">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="pb-2 text-gray-600 dark:text-gray-400">Name</th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Description
                </th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Last Updated
                </th>
                <th className="pb-2 text-gray-600 dark:text-gray-400">
                  Samples
                </th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    <Link
                      href={`/platform/datasets/${dataset.id}`}
                      className="rounded p-1 hover:bg-blue-50"
                    >
                      {dataset.name}
                    </Link>
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {dataset.description}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {new Date(dataset.last_modified).toLocaleString()}
                  </td>
                  <td className="py-2 text-gray-800 dark:text-gray-200">
                    {dataset.samples?.length || 0} samples
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link
          href="#"
          onClick={onUploadClick}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          New Dataset
        </Link>
      </div>
    </div>
  );
};
