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
  );
  const [hoveredTool, setHoveredTool] = useState(null);
  const [labels, setLabels] = useState([]);
  const [activeTab, setActiveTab] = useState('objects'); // 'objects' | 'labels' | 'issues'
  const [newLabel, setNewLabel] = useState('');

  // Load media metadata
  useEffect(() => {
    if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
      setIsVideo(true);
      const video = document.createElement("video");
      video.src = mediaUrl;
      video.addEventListener("loadedmetadata", () => {
        setTotalFrames(Math.floor(video.duration * video.frameRate || 30));
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
    { icon: "🔍", name: "Zoom Tool" },
    { icon: "↩", name: "Undo" },
    { icon: "⟲", name: "Reset" },
    { icon: "✏️", name: "Draw Rectangle" },
    { icon: "⬚", name: "Select Region" },
  ];

  const generateRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="mt-10"></div>
      {/* Top toolbar */}
      <div className="flex items-center space-x-2 border-b border-gray-300 bg-gray-100 p-2">
        <button className="rounded p-2 hover:bg-gray-200" title="Menu">
          <svg
            className="h-5 w-5"
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
            <div className="flex space-x-2 border-l border-r border-gray-300 px-2">
              <button
                className="rounded p-2 hover:bg-gray-200"
                onClick={() => setCurrentFrame(0)}
                title="First Frame"
              >
                ⏮
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200"
                onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                title="Previous Frame"
              >
                ⏪
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200"
                onClick={() =>
                  setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1))
                }
                title="Next Frame"
              >
                ⏩
              </button>
              <button
                className="rounded p-2 hover:bg-gray-200"
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
            <span className="text-sm text-gray-600">
              Frame: {currentFrame + 1} / {totalFrames}
            </span>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left toolbar */}
        <div className="w-12 border-r border-gray-300 bg-gray-100">
          <div className="flex flex-col items-center space-y-2 py-2">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="relative"
                onMouseEnter={() => setHoveredTool(tool.name)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <button className="rounded p-2 hover:bg-gray-200">
                  {tool.icon}
                </button>
                {hoveredTool === tool.name && (
                  <div className="absolute left-14 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-sm text-white">
                    {tool.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div className="relative flex-1">
          <KonvaCanvas
            annotations={annotations}
            setAnnotations={setAnnotations}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onMouseMove={handleMouseMove}
            mediaUrl={mediaUrl}
            currentFrame={currentFrame}
            isVideo={isVideo}
          />
        </div>

        {/* Right sidebar */}
        <div className="w-64 border-l border-gray-300 bg-gray-100">
          <div className="border-b border-gray-300">
            <div className="flex">
              <button
                className={`flex-1 border-r border-gray-300 px-4 py-2 text-sm font-medium ${
                  activeTab === 'objects' ? 'bg-gray-200' : ''
                }`}
                onClick={() => setActiveTab('objects')}
                title="View and edit objects"
              >
                Objects
              </button>
              <button
                className={`flex-1 border-r border-gray-300 px-4 py-2 text-sm font-medium ${
                  activeTab === 'labels' ? 'bg-gray-200' : ''
                }`}
                onClick={() => setActiveTab('labels')}
                title="Manage labels"
              >
                Labels
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'issues' ? 'bg-gray-200' : ''
                }`}
                onClick={() => setActiveTab('issues')}
                title="View issues"
              >
                Issues
              </button>
            </div>
          </div>

          {/* Coordinates display */}
          <div className="flex justify-center border-t border-gray-300 bg-gray-100 p-4">
            <Link
              href="/platform/dashboard"
              className="rounded-md bg-blue-500 px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
            >
              Continue
            </Link>
          </div>
          <div className="border-b border-gray-300 p-2 text-sm">
            <p className="mb-1 font-medium">Mouse Position:</p>
            <div className="flex space-x-4">
              <p>X: {mouseCoords.x}</p>
              <p>Y: {mouseCoords.y}</p>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'objects' && (
              <div>
                {annotations.map((anno) => (
                  <div
                    key={anno.id}
                    className={`mb-2 flex items-center justify-between rounded border p-2 ${
                      selectedId === anno.id ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedId(anno.id)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {anno.label && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: labels.find(l => l.name === anno.label)?.color 
                          }}
                        />
                      )}
                      <select
                        value={anno.label || ''}
                        onChange={(e) => {
                          const selectedLabel = labels.find(l => l.name === e.target.value);
                          setAnnotations(
                            annotations.map((a) =>
                              a.id === anno.id 
                                ? { 
                                    ...a, 
                                    label: e.target.value,
                                    color: selectedLabel?.color 
                                  } 
                                : a
                            )
                          );
                        }}
                        className="w-full border-none focus:ring-0"
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
                      className="ml-2 text-red-500"
                      title="Delete annotation"
                      onClick={() =>
                        setAnnotations(annotations.filter((a) => a.id !== anno.id))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'labels' && (
              <div>
                <div className="mb-4 flex space-x-2">
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Enter new label"
                    className="flex-1 rounded border border-gray-300 px-2 py-1"
                  />
                  <button
                    onClick={() => {
                      if (newLabel.trim() && !labels.find(l => l.name === newLabel.trim())) {
                        setLabels([
                          ...labels,
                          { 
                            name: newLabel.trim(), 
                            color: generateRandomColor() 
                          }
                        ]);
                        setNewLabel('');
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
                      className="flex items-center justify-between rounded border border-gray-300 p-2"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={label.color}
                          onChange={(e) => {
                            setLabels(labels.map(l => 
                              l.name === label.name 
                                ? { ...l, color: e.target.value }
                                : l
                            ));
                            setAnnotations(annotations.map(a => 
                              a.label === label.name 
                                ? { ...a, color: e.target.value }
                                : a
                            ));
                          }}
                          className="h-6 w-6 cursor-pointer"
                        />
                        <span>{label.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          setLabels(labels.filter((l) => l.name !== label.name));
                          setAnnotations(
                            annotations.map((a) =>
                              a.label === label.name ? { ...a, label: '' } : a
                            )
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

            {activeTab === 'issues' && (
              <div className="text-center text-gray-500">No issues found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
