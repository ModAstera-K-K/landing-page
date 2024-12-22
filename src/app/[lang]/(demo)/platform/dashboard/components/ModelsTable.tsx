import Link from "next/link";

interface Model {
  name: string;
  status: string;
  accuracy: string;
  lastUpdated: string;
}

interface ModelsTableProps {
  models: Model[];
  onTrainModelClick: () => void;
}

export function ModelsTable({ models, onTrainModelClick }: ModelsTableProps) {
  return (
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
            <th className="pb-2 text-gray-600 dark:text-gray-400">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {models.map((model, index) => (
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
        onClick={onTrainModelClick}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Train New Model
      </Link>
    </div>
  );
}
