"use client";

import { useState } from "react";

export default function ToolsToolbar({ selectedTool, setSelectedTool }) {
  const [hoveredTool, setHoveredTool] = useState(null);

  const tools = [
    { icon: "▢", name: "Rectangle", type: "box" },
    { icon: "〰️", name: "Polygon", type: "polygon" },
  ];

  return (
    <div className="border-r border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
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
                selectedTool === tool.type ? "bg-gray-300 dark:bg-gray-600" : ""
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
  );
}
