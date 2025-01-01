"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PlatformNavigation from "@/components/PlatformNavigation";
import SampleCard from "@/components/SampleCard";
import Pagination from "@/components/Pagination";
import { AddSamplesForm } from "@/app/[lang]/(demo)/platform/dashboard/components/AddSamplesForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [showAddSamplesForm, setShowAddSamplesForm] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

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

  useEffect(() => {
    fetchDataset();
  }, [params.id]);

  const handleUpdate = async (field: "name" | "description", value: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/datasets/${params.id}/`,
        { [field]: value },
        { withCredentials: true },
      );
      setDataset((prev) => (prev ? { ...prev, [field]: value } : null));
    } catch (err) {
      setError(`Failed to update ${field}`);
    }
  };

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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSamples =
    dataset.samples?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />

      {/* Dataset Info */}
      <div className="mb-8">
        {isEditingName ? (
          <input
            type="text"
            aria-label="Dataset name"
            className="border-b border-gray-300 bg-transparent text-2xl font-bold text-gray-900 focus:border-blue-500 focus:outline-none dark:text-white"
            value={dataset.name}
            onChange={(e) =>
              setDataset((prev) =>
                prev ? { ...prev, name: e.target.value } : null,
              )
            }
            onBlur={(e) => {
              setIsEditingName(false);
              handleUpdate("name", e.target.value);
            }}
            autoFocus
          />
        ) : (
          <h1
            className="cursor-pointer text-2xl font-bold text-gray-900 hover:opacity-80 dark:text-white"
            onClick={() => setIsEditingName(true)}
          >
            {dataset.name}
          </h1>
        )}

        {isEditingDescription ? (
          <textarea
            aria-label="Dataset description"
            className="mt-2 w-full rounded border bg-transparent p-2 text-gray-600 focus:border-blue-500 focus:outline-none dark:text-gray-400"
            value={dataset.description}
            onChange={(e) =>
              setDataset((prev) =>
                prev ? { ...prev, description: e.target.value } : null,
              )
            }
            onBlur={(e) => {
              setIsEditingDescription(false);
              handleUpdate("description", e.target.value);
            }}
            autoFocus
          />
        ) : (
          <p
            className="mt-2 cursor-pointer text-gray-600 hover:opacity-80 dark:text-gray-400"
            onClick={() => setIsEditingDescription(true)}
          >
            {dataset.description}
          </p>
        )}

        <p className="mt-1 text-sm text-gray-500">
          Last modified: {new Date(dataset.last_modified).toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Total samples: {dataset.samples?.length || 0}
        </p>
      </div>

      {/* Samples Grid */}
      {!dataset.samples || dataset.samples.length === 0 ? (
        <div className="mb-8 text-center text-gray-600 dark:text-gray-400">
          No samples available in this dataset.
        </div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {currentSamples.map((sampleId) => (
              <SampleCard
                key={sampleId}
                sampleId={sampleId}
                datasetId={params.id}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={dataset.samples?.length || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <Link href={`/platform/annotation/${params.id}`}>
          <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Edit Annotations
          </button>
        </Link>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => setShowAddSamplesForm(true)}
        >
          Add Samples
        </button>
      </div>

      {/* Dialog for AddSamplesForm */}
      <Dialog open={showAddSamplesForm} onOpenChange={setShowAddSamplesForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add Samples to Dataset</DialogTitle>
            <DialogDescription>
              Upload new samples to add to this dataset.
            </DialogDescription>
          </DialogHeader>

          <AddSamplesForm
            datasetId={params.id}
            setShowAddSamplesForm={setShowAddSamplesForm}
            onSuccess={() => {
              fetchDataset();
              setCurrentPage(1); // Reset to first page
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
