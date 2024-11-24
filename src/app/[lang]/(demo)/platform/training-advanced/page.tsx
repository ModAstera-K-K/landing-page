"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";
import PlatformNavigation from "@/components/PlatformNavigation";
import modelCode from "@/app/[lang]/(demo)/platform/modelCode";

// Sample data for nodes and edges
const initialNodes = [
  {
    id: "1",
    type: "default",
    data: {
      label: (
        <NodeContent
          title="Preprocessing"
          details={["Image Segmentation", "Image Augmentation", "Reshape"]}
        />
      ),
    },
    position: { x: 50, y: 100 },
  },
  {
    id: "2",
    type: "default",
    data: {
      label: (
        <NodeContent
          title="Model Candidates Training"
          details={[
            "Object Detection - Trained",
            "Image Classification - Trained",
          ]}
        />
      ),
    },
    position: { x: 300, y: 100 },
  },
  {
    id: "3",
    type: "default",
    data: {
      label: (
        <NodeContent
          title="Model Candidates Evaluation"
          details={["Accuracy", "F1 Score", "TP, TN, FP, FN", "Done"]}
        />
      ),
    },
    position: { x: 550, y: 100 },
  },
  {
    id: "4",
    type: "default",
    data: {
      label: (
        <NodeContent title="Model Selection" details={["F1 Score", "Done"]} />
      ),
    },
    position: { x: 800, y: 100 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
  { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
  { id: "e3-4", source: "3", target: "4", type: "smoothstep" },
];

interface NodeContentProps {
  title: string;
  details: string[];
}

function NodeContent({ title, details }: NodeContentProps) {
  return (
    <div className="text-center">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AdvancedView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showCode, setShowCode] = useState(false);
  const [pythonCode, setPythonCode] = useState(modelCode);
  const codePopupRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const handleNodeClick = (event, node) => {
    if (node.id === "2") {
      setShowCode(true);
      setPopupPosition({ top: 100, left: 400 });
    }
  };

  const handleClickOutside = (event) => {
    if (codePopupRef.current && !codePopupRef.current.contains(event.target)) {
      setShowCode(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    console.log("Edit button clicked");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      {/* Instructions Box */}
      <div className="w-64 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-md dark:bg-gray-800 dark:text-gray-300">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          Instructions
        </h3>
        <p className="mt-2">
          Train multiple models and select the best one to predict Sepsis early
          detection from the uploaded images.
        </p>
      </div>

      {/* React Flow Canvas */}
      <div className="mt-4 h-[640px] w-full rounded-lg bg-white shadow-md dark:bg-gray-800">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          style={{ width: "100%", height: "100%" }}
          onNodeClick={handleNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>

      {/* Code Display */}
      {showCode && (
        <div
          ref={codePopupRef}
          className="absolute bg-gray-900 text-gray-200 p-4 rounded shadow-md"
          style={{ top: 100, left: 400 }}
        >
          <pre className="overflow-x-auto">
            {pythonCode}
          </pre>
          <button
            onClick={handleEditClick}
            className="mt-4 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
            style={{ position: 'absolute', bottom: '10px', right: '10px' }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
