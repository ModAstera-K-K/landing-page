"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const KonvaCanvas = dynamic(() => import("./KonvaCanvas"), {
  ssr: false,
  loading: () => <div>Loading canvas...</div>,
});

export default function AnnotationPage() {
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [hoveredTool, setHoveredTool] = useState(null);

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

  return (
    <div className="flex h-screen flex-col">
      {/* Top toolbar */}
      <div className="mt-8"></div>
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

        <div className="flex space-x-2 border-l border-r border-gray-300 px-2">
          <button className="rounded p-2 hover:bg-gray-200" title="First Frame">
            ⏮
          </button>
          <button
            className="rounded p-2 hover:bg-gray-200"
            title="Previous Frame"
          >
            ⏪
          </button>
          <button className="rounded p-2 hover:bg-gray-200" title="Play/Pause">
            ▶
          </button>
          <button className="rounded p-2 hover:bg-gray-200" title="Next Frame">
            ⏩
          </button>
          <button className="rounded p-2 hover:bg-gray-200" title="Last Frame">
            ⏭
          </button>
        </div>

        <input
          type="range"
          className="w-96"
          min="0"
          max="100"
          defaultValue="0"
          title="Timeline"
        />
        <span className="text-sm text-gray-600">0</span>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left toolbar */}
        <div className="w-12 bg-gray-100 border-r border-gray-300">
          <div className="flex flex-col items-center py-2 space-y-2">
            {tools.map((tool) => (
              <div 
                key={tool.name} 
                className="relative"
                onMouseEnter={() => setHoveredTool(tool.name)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <button className="p-2 hover:bg-gray-200 rounded">
                  {tool.icon}
                </button>
                {hoveredTool === tool.name && (
                  <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50">
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
          />
        </div>

        {/* Right sidebar */}
        <div className="w-64 border-l border-gray-300 bg-gray-100">
          <div className="border-b border-gray-300">
            <div className="flex">
              <button
                className="flex-1 border-r border-gray-300 px-4 py-2 text-sm font-medium"
                title="View and edit objects"
              >
                Objects
              </button>
              <button
                className="flex-1 border-r border-gray-300 px-4 py-2 text-sm font-medium"
                title="Manage labels"
              >
                Labels
              </button>
              <button
                className="flex-1 px-4 py-2 text-sm font-medium"
                title="View issues"
              >
                Issues
              </button>
            </div>
          </div>

          {/* Coordinates display */}
          <div className="border-b border-gray-300 p-2 text-sm">
            <p className="mb-1 font-medium">Mouse Position:</p>
            <div className="flex space-x-4">
              <p>X: {mouseCoords.x}</p>
              <p>Y: {mouseCoords.y}</p>
            </div>
          </div>

          <div className="p-4">
            {annotations.map((anno) => (
              <div
                key={anno.id}
                className={`mb-2 flex items-center justify-between rounded border p-2 ${
                  selectedId === anno.id ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedId(anno.id)}
              >
                <input
                  type="text"
                  value={anno.label}
                  onChange={(e) =>
                    setAnnotations(
                      annotations.map((a) =>
                        a.id === anno.id ? { ...a, label: e.target.value } : a,
                      ),
                    )
                  }
                  placeholder="Label"
                  className="w-full border-none focus:ring-0"
                  title="Enter label text"
                />
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
        </div>
      </div>
    </div>
  );
}
