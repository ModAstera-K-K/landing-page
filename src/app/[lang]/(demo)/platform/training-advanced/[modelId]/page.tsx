"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
} from "react-flow-renderer";
import PlatformNavigation from "@/components/PlatformNavigation";
import modelCode from "@/app/[lang]/(demo)/platform/modelCode";
import { Highlight, themes } from "prism-react-renderer";
import { useParams } from "next/navigation";
import modelsData from "../../modelsData";
import Editor from "react-simple-code-editor";

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
    <div className="scale-60 transform text-center">
      <h3 className="text-xs font-semibold text-gray-800 dark:text-black">
        {title}
      </h3>
      <ul className="mt-2 space-y-1 text-[0.64rem] text-gray-600 dark:text-black">
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AdvancedView() {
  const params = useParams();
  const modelId = params?.modelId as string;

  // Find the specific model
  const model = modelsData.find(
    (m) => m.name.toLowerCase().replace(/\s+/g, "-") === modelId,
  );

  // Use model's training instructions or default
  const trainingInstructions =
    model?.trainingInstructions ||
    "Train multiple models and select the best one to predict Sepsis early detection from the uploaded images.";

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showCode, setShowCode] = useState(false);
  const [pythonCode, setPythonCode] = useState(modelCode);
  const [isEditing, setIsEditing] = useState(false);
  const [isCodeModified, setIsCodeModified] = useState(false);
  const flowInstance = useRef<ReactFlowInstance | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    flowInstance.current = instance;
  }, []);

  useEffect(() => {
    if (flowInstance.current) {
      const zoom = showCode ? 0.6 : 1;
      flowInstance.current.setViewport({ x: 0, y: 0, zoom });
      // Add a small delay before fitting view to ensure smooth transition
      setTimeout(() => {
        flowInstance.current?.fitView({ padding: 0.3, duration: 200 });
      }, 50);
    }
  }, [showCode]);

  const handleNodeClick = (event: any, node: { id: string }) => {
    if (node.id === "2") {
      setShowCode((prev) => !prev);
    }
  };

  const handleEditClick = () => {
    setIsEditing((prev) => {
      if (prev) {
        // When saving (switching from edit to view mode)
        setIsCodeModified(pythonCode !== modelCode);
      }
      return !prev;
    });
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPythonCode(event.target.value);
  };

  const handleRetrain = () => {
    // Add your retraining logic here
    console.log("Retraining with modified code...");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <PlatformNavigation />
      <div className={`flex ${showCode ? "flex-row" : "flex-col"}`}>
        <div className={`${showCode ? "w-2/5" : "w-full"} p-4`}>
          {/* Instructions Box */}
          <div className="w-64 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-md dark:bg-gray-800 dark:text-gray-200">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Training Instructions
            </h3>
            <p className="mt-2">{trainingInstructions}</p>
          </div>

          {/* React Flow Canvas */}
          <div className="mt-4 h-[452px] w-full rounded-lg bg-white shadow-md dark:bg-gray-700">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onInit={onInit}
              fitView
              fitViewOptions={{ padding: 0.3 }} // Adjust zoom level
              style={{ width: "100%", height: "100%" }}
              onNodeClick={handleNodeClick}
            >
              {!showCode && <MiniMap />}
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
        </div>

        {/* Code Display */}
        {showCode && (
          <div className="flex max-h-[624px] w-3/5 flex-col rounded bg-gray-900 p-4 text-gray-200 shadow-md dark:bg-gray-800">
            <div className="mb-2 flex justify-end gap-2">
              {isCodeModified && !isEditing && (
                <button
                  className="rounded bg-green-500 px-2 py-1 text-white dark:bg-green-700"
                  onClick={handleRetrain}
                >
                  Retrain
                </button>
              )}
              <button
                className="rounded bg-blue-500 px-2 py-1 text-white dark:bg-blue-700"
                onClick={handleEditClick}
              >
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                className="rounded bg-gray-500 px-2 py-1 text-white dark:bg-gray-700"
                onClick={() => setShowCode(false)}
              >
                Close
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {isEditing ? (
                <Editor
                  value={pythonCode}
                  onValueChange={code => setPythonCode(code)}
                  highlight={code => (
                    <Highlight theme={themes.nightOwl} code={code} language="python">
                      {({ tokens, getLineProps, getTokenProps }) => (
                        <>
                          {tokens.map((line, i) => (
                            <div {...getLineProps({ line, key: i })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                              ))}
                            </div>
                          ))}
                        </>
                      )}
                    </Highlight>
                  )}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    backgroundColor: 'transparent',
                    minHeight: '100%',
                  }}
                  textareaClassName="focus:outline-none"
                />
              ) : (
                <Highlight
                  theme={themes.nightOwl}
                  code={pythonCode}
                  language="python"
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre className="overflow-x-auto">
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
