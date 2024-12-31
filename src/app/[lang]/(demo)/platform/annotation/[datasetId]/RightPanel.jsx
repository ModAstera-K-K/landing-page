import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function RightPanel({
  datasetId,
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
  isVideo,
  currentFrame,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [frameAnnotations, setFrameAnnotations] = useState({});
  const [shouldPersist, setShouldPersist] = useState(false);

  // Initialize frame annotations when sample data changes
  useEffect(() => {
    if (isVideo && sampleData?.annotations) {
      const frameMap = {};
      const usedIds = new Set(); // Track used IDs

      sampleData.annotations.forEach((annotation) => {
        const frame = annotation.frame || 0;
        if (!frameMap[frame]) {
          frameMap[frame] = [];
        }

        // Ensure unique ID for each annotation
        let annotationWithUniqueId = { ...annotation };
        if (
          !annotationWithUniqueId.id ||
          usedIds.has(annotationWithUniqueId.id)
        ) {
          annotationWithUniqueId.id = crypto.randomUUID();
        }
        usedIds.add(annotationWithUniqueId.id);

        frameMap[frame].push(annotationWithUniqueId);
      });

      setFrameAnnotations(frameMap);
      // Set initial annotations for current frame
      setAnnotations(frameMap[currentFrame] || []);
    } else if (!isVideo && sampleData?.annotations) {
      // Handle non-video annotations
      const uniqueAnnotations = sampleData.annotations.map((annotation) => ({
        ...annotation,
        id: annotation.id || crypto.randomUUID(),
      }));
      setAnnotations(uniqueAnnotations);
    }
  }, [isVideo, sampleData, currentFrame, setAnnotations]);

  // Handle frame changes and persistence
  useEffect(() => {
    if (!isVideo) return;

    // Store current frame's annotations with guaranteed unique IDs
    const annotationsWithUniqueIds = annotations.map((anno) => ({
      ...anno,
      id: anno.id || crypto.randomUUID(),
    }));

    setFrameAnnotations((prev) => ({
      ...prev,
      [currentFrame]: annotationsWithUniqueIds,
    }));
  }, [isVideo, currentFrame, annotations]);

  // Handle persistence when frame changes
  useEffect(() => {
    if (!isVideo || !shouldPersist) return;

    // Get annotations for the current frame
    const currentAnnotations = frameAnnotations[currentFrame];

    // If current frame has no annotations but previous frame does, copy them
    if (
      !currentAnnotations?.length &&
      currentFrame > 0 &&
      frameAnnotations[currentFrame - 1]?.length
    ) {
      const previousAnnotations = frameAnnotations[currentFrame - 1];
      const newAnnotations = previousAnnotations.map((anno) => ({
        ...anno,
        id: crypto.randomUUID(), // Always generate new ID when copying
        frame: currentFrame,
      }));

      setFrameAnnotations((prev) => ({
        ...prev,
        [currentFrame]: newAnnotations,
      }));
      setAnnotations(newAnnotations);
    } else {
      // Set the current frame's annotations
      setAnnotations(currentAnnotations || []);
    }
  }, [isVideo, currentFrame, shouldPersist, frameAnnotations]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      let annotationsToSave;
      if (isVideo) {
        // Flatten frame annotations into a single array and ensure unique IDs
        annotationsToSave = Object.entries(frameAnnotations).flatMap(
          ([frame, annotations]) =>
            annotations.map((annotation) => ({
              ...annotation,
              frame: parseInt(frame),
              id: annotation.id || crypto.randomUUID(), // Ensure unique ID
            })),
        );
      } else {
        annotationsToSave = annotations;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/samples/${sampleData.id}/`,
        {
          annotations: annotationsToSave,
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
    } finally {
      setIsSaving(false);
    }
  };

  // Handle annotation label change
  const handleLabelChange = useCallback(
    (annotationId, newLabel) => {
      const selectedLabel = labels.find((l) => l.name === newLabel);
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((a) =>
          a.id === annotationId
            ? {
                ...a,
                label: newLabel,
                color: selectedLabel?.color,
              }
            : a,
        ),
      );
    },
    [labels, setAnnotations],
  );

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
      {isVideo && (
        <div className="border-b border-gray-300 p-2 dark:border-gray-700">
          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={shouldPersist}
              onChange={(e) => setShouldPersist(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span>Persist annotations to next frame</span>
          </label>
        </div>
      )}
      <div className="p-4">
        {activeTab === "objects" && (
          <div>
            {isVideo && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Frame: {currentFrame + 1}
                {frameAnnotations[currentFrame]?.length > 0 && (
                  <span>
                    {" "}
                    ({frameAnnotations[currentFrame].length} annotations)
                  </span>
                )}
              </div>
            )}

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
                    onChange={(e) => handleLabelChange(anno.id, e.target.value)}
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
                onClick={async () => {
                  if (
                    newLabel.trim() &&
                    !labels.find((l) => l.name === newLabel.trim())
                  ) {
                    const updatedLabels = [
                      ...labels,
                      {
                        name: newLabel.trim(),
                        color: generateRandomColor(),
                      },
                    ];

                    try {
                      await axios.patch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/datasets/${datasetId}/`,
                        {
                          labels: updatedLabels,
                        },
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                          withCredentials: true,
                        },
                      );

                      setLabels(updatedLabels);
                      setNewLabel("");
                    } catch (error) {
                      console.error(
                        "Error updating labels:",
                        error.response?.data || error.message,
                      );
                      // Add error handling/notification here
                    }
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
