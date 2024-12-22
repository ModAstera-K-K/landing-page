"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PlatformNavigation from "@/components/PlatformNavigation";
import SampleCard from "@/components/SampleCard";

interface Dataset {
  id: string;
  name: string;
  description: string;
  last_modified: string;
  samples: string[];
}

export default function DatasetView({ params }: { params: { id: string } }) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/datasets/${params.id}`,
          {
            withCredentials: true,
          },
        );
        setDataset(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch dataset");
        setIsLoading(false);
      }
    };

    fetchDataset();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
        <PlatformNavigation />
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Loading dataset...
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
        <PlatformNavigation />
        <div className="mt-8 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />

      {/* Dataset Info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {dataset.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {dataset.description}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Last modified: {new Date(dataset.last_modified).toLocaleString()}
        </p>
      </div>

      {/* Samples Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dataset.samples.map((sampleId) => (
          <SampleCard key={sampleId} sampleId={sampleId} />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Link
          href={`/platform/datasets/${dataset.id}/upload`}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Upload Samples
        </Link>
        <Link
          href={`/platform/datasets/${dataset.id}/upload-annotations`}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Upload Annotation File
        </Link>
      </div>
    </div>
  );
}
