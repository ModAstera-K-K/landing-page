import React, { useState } from "react";
import axios from "axios";

export default function RightPanel({
  activeTab,
  setActiveTab,
  sampleData,
  handlePreviousSample,
  handleNextSample,
  getPreviousSampleId,
  getNextSampleId,
  mouseCoords,
  annotations,
  setAnnotations,
  selectedId,
  setSelectedId,
  labels,
  setLabels,
  newLabel,
  setNewLabel,
  generateRandomColor,
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    console.log("Saving annotations:", annotations);
    try {
      setIsSaving(true);
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/samples/${sampleData.id}/`,
        {
          annotations: annotations,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      console.log("Save successful:", response.data);
    } catch (error) {
      console.error(
        "Error saving annotations:",
        error.response?.data || error.message,
      );
      // You might want to add proper error handling/notification here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-64 border-l border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-300 dark:border-gray-700">
        <div className="flex">
          <button
            className={`flex-1 border-r border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-700 ${
              activeTab === "objects" ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("objects")}
            title="View and edit objects"
          >
            Objects
          </button>
          <button
            className={`flex-1 border-r border-gray-300 px-4 py-2 text-sm font-medium dark:border-gray-700 ${
              activeTab === "labels" ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("labels")}
            title="Manage labels"
          >
            Labels
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === "issues" ? "bg-gray-200 dark:bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab("issues")}
            title="View issues"
          >
            Issues
          </button>
        </div>
      </div>
      {/* Navigation buttons */}
      <div className="p-2 text-center text-xs text-gray-500 dark:text-gray-400">
        {sampleData.name}
      </div>
      <div className="flex justify-between border-gray-300 p-2 dark:border-gray-700">
        <button
          onClick={handlePreviousSample}
          className={`rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50`}
          disabled={!getPreviousSampleId()}
        >
          Previous
        </button>
        <button
          onClick={handleNextSample}
          className={`rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50`}
          disabled={!getNextSampleId()}
        >
          Next
        </button>
      </div>
      <div className="flex flex-col items-center justify-center border-b border-gray-300 p-2 text-sm dark:border-gray-700">
        <p className="mb-1 font-medium text-black dark:text-white">
          Mouse Position:
        </p>
        <div className="flex space-x-4 text-black dark:text-white">
          <p>X: {Math.round(mouseCoords.x)}</p>
          <p>Y: {Math.round(mouseCoords.y)}</p>
        </div>
      </div>
      <div className="p-4">
        {activeTab === "objects" && (
          <div>
            {annotations.map((anno) => (
              <div
                key={anno.id}
                className={`mb-2 flex cursor-pointer items-center justify-between rounded border p-2 ${
                  selectedId === anno.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedId(anno.id)}
              >
                <div className="flex flex-1 items-center space-x-2">
                  {anno.label && (
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: labels.find(
                          (l) => l.name === anno.label,
                        )?.color,
                      }}
                    />
                  )}
                  <select
                    value={anno.label || ""}
                    onChange={(e) => {
                      const selectedLabel = labels.find(
                        (l) => l.name === e.target.value,
                      );
                      setAnnotations(
                        annotations.map((a) =>
                          a.id === anno.id
                            ? {
                                ...a,
                                label: e.target.value,
                                color: selectedLabel?.color,
                              }
                            : a,
                        ),
                      );
                    }}
                    className="w-full border-none focus:ring-0 dark:bg-gray-800 dark:text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Select a label</option>
                    {labels.map((label) => (
                      <option key={label.name} value={label.name}>
                        {label.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  title="Delete annotation"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedId === anno.id) {
                      setSelectedId(null);
                    }
                    setAnnotations(annotations.filter((a) => a.id !== anno.id));
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="mt-4 flex flex-col gap-2">
              {selectedId && (
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-full rounded bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Clear Selection
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded bg-green-500 px-3 py-2 text-sm text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {isSaving ? "Saving..." : "Save Annotations"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "labels" && (
          <div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Enter new label"
                className="w-full rounded border border-gray-300 px-2 py-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={() => {
                  if (
                    newLabel.trim() &&
                    !labels.find((l) => l.name === newLabel.trim())
                  ) {
                    setLabels([
                      ...labels,
                      {
                        name: newLabel.trim(),
                        color: generateRandomColor(),
                      },
                    ]);
                    setNewLabel("");
                  }
                }}
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {labels.map((label) => (
                <div
                  key={label.name}
                  className="flex items-center justify-between rounded border border-gray-300 p-2 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={label.color}
                      onChange={(e) => {
                        setLabels(
                          labels.map((l) =>
                            l.name === label.name
                              ? { ...l, color: e.target.value }
                              : l,
                          ),
                        );
                        setAnnotations(
                          annotations.map((a) =>
                            a.label === label.name
                              ? { ...a, color: e.target.value }
                              : a,
                          ),
                        );
                      }}
                      className="h-6 w-6 cursor-pointer"
                    />
                    <span className="text-black dark:text-white">
                      {label.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setLabels(labels.filter((l) => l.name !== label.name));
                      setAnnotations(
                        annotations.map((a) =>
                          a.label === label.name ? { ...a, label: "" } : a,
                        ),
                      );
                    }}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "issues" && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No issues found
          </div>
        )}
      </div>
    </div>
  );
}
