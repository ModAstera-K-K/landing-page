"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const KonvaCanvas = dynamic(() => import("./KonvaCanvas"), {
  ssr: false,
  loading: () => <div>Loading canvas...</div>,
});

export default function AnnotationPage() {
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(
    "/images/examples/chest-x-ray-29.jpg",
    // "/images/examples/modastera-demo-1.mp4",
  );
  const [hoveredTool, setHoveredTool] = useState(null);
  const [labels, setLabels] = useState([]);
  const [activeTab, setActiveTab] = useState("objects"); // 'objects' | 'labels' | 'issues'
  const [newLabel, setNewLabel] = useState("");
  const [selectedTool, setSelectedTool] = useState("box"); // 'box' | 'polygon'

  // Load media metadata
  useEffect(() => {
    if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
      setIsVideo(true);
      const video = document.createElement("video");
      video.src = mediaUrl;
      video.addEventListener("loadedmetadata", () => {
        setTotalFrames(Math.floor(video.duration * video.frameRate));
      });
    } else {
      setIsVideo(false);
      setTotalFrames(0);
    }
  }, [mediaUrl]);

  const handleMouseMove = (coords) => {
    setMouseCoords(coords);
  };

  const tools = [
    { icon: "▢", name: "Rectangle", type: "box" },
    { icon: "〰️", name: "Polygon", type: "polygon" },
  ];

  const generateRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEEAD",
      "#D4A5A5",
      "#9B59B6",
      "#3498DB",
      "#E67E22",
      "#2ECC71",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-900">
      <div className="mt-10"></div>
      {/* Top toolbar */}
      <div className="flex items-center space-x-2 border-b border-gray-300 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800">
        <button
          className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Menu"
        >
          <svg
            className="h-5 w-5 text-black dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {isVideo && (
          <>
            <div className="flex space-x-2 border-l border-r border-gray-300 px-2 dark:border-gray-700">
              <button
                className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setCurrentFrame(0)}
                title="First Frame"
              >
                ⏮
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                title="Previous Frame"
              >
                ⏪
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() =>
                  setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1))
                }
                title="Next Frame"
              >
                ⏩
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setCurrentFrame(totalFrames - 1)}
                title="Last Frame"
              >
                ⏭
              </button>
            </div>

            <input
              type="range"
              className="w-96"
              min="0"
              max={totalFrames - 1}
              value={currentFrame}
              onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
              title="Timeline"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Frame: {currentFrame + 1} / {totalFrames}
            </span>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left toolbar */}
        <div className="w-12 border-r border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center space-y-2 py-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="relative"
                onMouseEnter={() => setHoveredTool(tool.name)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <button
                  className={`rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    selectedTool === tool.type
                      ? "bg-gray-300 dark:bg-gray-600"
                      : ""
                  }`}
                  onClick={() => setSelectedTool(tool.type)}
                >
                  {tool.icon}
                </button>
                {hoveredTool === tool.name && (
                  <div className="absolute left-14 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white dark:bg-gray-700">
                    {tool.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-white dark:bg-gray-900">
          <KonvaCanvas
            annotations={annotations}
            setAnnotations={setAnnotations}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onMouseMove={handleMouseMove}
            mediaUrl={mediaUrl}
            currentFrame={currentFrame}
            isVideo={isVideo}
            selectedTool={selectedTool}
          />
        </div>

        {/* Right sidebar */}
        <div className="w-64 border-l border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
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

          {/* Coordinates display */}
          <div className="flex justify-center border-t border-gray-300 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800">
            <Link
              href="/platform/dashboard"
              className="rounded-md bg-blue-500 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
            >
              Continue
            </Link>
          </div>
          <div className="border-b border-gray-300 p-2 text-sm dark:border-gray-700">
            <p className="mb-1 font-medium text-black dark:text-white">
              Mouse Position:
            </p>
            <div className="flex space-x-4 text-black dark:text-white">
              <p>X: {mouseCoords.x}</p>
              <p>Y: {mouseCoords.y}</p>
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
                        setAnnotations(
                          annotations.filter((a) => a.id !== anno.id),
                        );
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {selectedId && (
                  <button
                    onClick={() => setSelectedId(null)}
                    className="mt-4 w-full rounded bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Clear Selection
                  </button>
                )}
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
                          setLabels(
                            labels.filter((l) => l.name !== label.name),
                          );
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
      </div>
    </div>
  );
}
