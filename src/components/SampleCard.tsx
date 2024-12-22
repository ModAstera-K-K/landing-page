import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface Sample {
  id: string;
  file: string;
  name: string;
  data_type: string;
  created: string;
  annotations: any | null;
  tags: string[];
}

export default function SampleCard({
  sampleId,
  datasetId,
}: {
  sampleId: string;
  datasetId: string;
}) {
  const [sample, setSample] = useState<Sample | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/samples/${sampleId}`,
          { withCredentials: true },
        );
        setSample(response.data);
      } catch (err) {
        setError("Failed to load sample");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSample();
  }, [sampleId]);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="mb-4 h-48 animate-pulse bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (error || !sample) {
    return (
      <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="text-red-500">Failed to load sample</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      {sample.data_type === "image" ? (
        <Image
          src={sample.file}
          alt={sample.name || `Sample ${sample.id}`}
          width={400}
          height={192}
          className="mb-4 h-48 w-full rounded object-cover"
        />
      ) : (
        <div className="mb-4 flex h-48 items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
          <span className="text-gray-500 dark:text-gray-400">
            {sample.data_type ? sample.data_type.toUpperCase() : "UNKNOWN"}
          </span>
        </div>
      )}
      <div className="my-auto flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {sample.name.length > 16
            ? `${sample.name.slice(0, 16)}...`
            : sample.name}{" "}
        </span>
        {sample.annotations.length === 0 && (
          <Link
            href={`/platform/annotation/${datasetId}?sampleId=${sample.id}`}
            className="rounded p-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
