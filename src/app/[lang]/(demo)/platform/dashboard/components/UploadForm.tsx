import React, { useState } from "react";
import { FileUpload } from "../types";
import axios from "axios";

interface UploadFormProps {
  setShowUploadForm: (show: boolean) => void;
}

export const UploadForm = ({ setShowUploadForm }: UploadFormProps) => {
  const [datasetName, setDatasetName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<
    Array<{
      file: File;
      progress?: number;
      status?: "uploading" | "completed" | "error";
      error?: string;
      dataType?: string;
    }>
  >([]);

  const determineDataType = (
    file: File,
  ): "image" | "video" | "text" | "audio" | undefined => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension) return "text";

    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
        return "image";
      case "mp4":
        return "video";
      case "txt":
        return "text";
      case "wav":
        return "audio";
      default:
        setUploadError("Unsupported file type in selection.");
        return undefined;
    }
  };

  const handleFileUpload = async () => {
    if (!datasetName || filesToUpload.length === 0) return;
    setIsUploading(true);

    try {
      // Upload files sequentially
      for (let i = 0; i < filesToUpload.length; i++) {
        const fileUpload = filesToUpload[i];
        if (fileUpload.status === "completed") continue;

        // Validate file type
        try {
          determineDataType(fileUpload.file);
        } catch (error) {
          setFilesToUpload((prev) =>
            prev.map((item, index) =>
              index === i
                ? { ...item, status: "error", error: "Unsupported file type" }
                : item,
            ),
          );
          continue;
        }

        const formData = new FormData();
        formData.append("file", fileUpload.file);
        formData.append("dataset_name", datasetName);
        const dataType =
          fileUpload.dataType || determineDataType(fileUpload.file);
        if (dataType) {
          formData.append("data_type", dataType);
        }

        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/samples/`,
            formData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = progressEvent.total
                  ? Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total,
                    )
                  : 0;

                setFilesToUpload((prev) =>
                  prev.map((item, index) =>
                    index === i
                      ? { ...item, progress, status: "uploading" }
                      : item,
                  ),
                );
              },
            },
          );

          // Update file status to completed
          setFilesToUpload((prev) =>
            prev.map((item, index) =>
              index === i
                ? { ...item, status: "completed", progress: 100 }
                : item,
            ),
          );
        } catch (error) {
          throw new Error("Upload error");
        }
      }

      // All files uploaded successfully
      const totalSize = filesToUpload.reduce(
        (acc, item) => acc + item.file.size,
        0,
      );

      // const newDataset = {
      //   name: datasetName,
      //   size: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
      //   lastUpdated: new Date().toISOString().split("T")[0],
      //   annotationPath: "/platform/annotation",
      // };
      // datasetsData.unshift(newDataset); // TODO: update the datasets list

      // Reset form
      setDatasetName("");
      setFilesToUpload([]);
      setShowUploadForm(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
      dataType: determineDataType(file),
    }));
    setFilesToUpload(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
      dataType: determineDataType(file),
    }));
    setFilesToUpload(files);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Upload Dataset
      </h2>
      <div
        className="mb-4 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-300 p-8 dark:border-gray-600"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleFileDrop}
      >
        <input
          id="fileInput"
          aria-label="Upload files"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileInput}
        />
        {filesToUpload.length > 0 ? (
          <div className="w-full">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Selected:{" "}
                {filesToUpload
                  .slice(0, 10)
                  .map((f) => f.file.name)
                  .join(", ")}
                {filesToUpload.length > 10 ? "..." : ""}
              </p>
              <button
                onClick={() => {
                  setFilesToUpload([]);
                  setUploadError(null);
                }}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
            {isUploading && (
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
            {uploadError && (
              <p className="mt-2 text-sm text-red-500">{uploadError}</p>
            )}
          </div>
        ) : (
          <>
            <div
              onClick={() => document.getElementById("fileInput")?.click()}
              className="cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="mb-2 h-12 w-12 text-gray-400 dark:text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop your dataset here
            </p>
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
              or click the plus icon to select files (images, CSV, JSON)
            </p>
          </>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-gray-600 dark:text-gray-400">
          Dataset Name
        </label>
        <input
          type="text"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          placeholder="Enter a name for your dataset"
          className="w-full rounded border border-gray-300 bg-white p-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleFileUpload()}
          disabled={
            !filesToUpload.length ||
            !datasetName ||
            isUploading ||
            !!uploadError
          }
          className={`rounded px-4 py-2 font-semibold text-white ${
            !filesToUpload.length ||
            !datasetName ||
            isUploading ||
            !!uploadError
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setShowUploadForm(false)}
          disabled={isUploading}
          className="rounded bg-gray-400 px-4 py-2 font-semibold text-white hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
