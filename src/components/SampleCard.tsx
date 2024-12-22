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

export default function SampleCard({ sampleId }: { sampleId: string }) {
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
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{sample.name}</span>
        {sample.annotations.length === 0 && (
          <Link
            href={`/platform/annotation/${sample.id}`}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            Annotate
          </Link>
        )}
      </div>
    </div>
  );
}
