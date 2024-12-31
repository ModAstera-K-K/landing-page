"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
} from "react-flow-renderer";

const staticTaskData = {
  title: "Example Task",
  task_summary:
    "Generate two random 3-dimensional vectors, compute their dot product, find their magnitudes, and calculate the angle between them in degrees.",
  steps: [
    {
      step: 1,
      reasoning: "Generate the first random 3D vector",
      explanation:
        "Use numpy's random.rand function to generate a 3D vector with random values.",
      function: "numpy.random.rand",
      parameters: {
        d0: 3,
      },
    },
    {
      step: 2,
      reasoning: "Generate the second random 3D vector",
      explanation:
        "Use numpy's random.rand function to generate another 3D vector with random values.",
      function: "numpy.random.rand",
      parameters: {
        d0: 3,
      },
    },
    {
      step: 3,
      reasoning: "Compute the dot product of the two vectors",
      explanation:
        "Use numpy's dot function to compute the dot product of the two vectors. This is necessary to find the angle between them.",
      function: "numpy.dot",
      parameters: {
        a: "previous_result_1",
        b: "previous_result_2",
      },
    },
    {
      step: 4,
      reasoning: "Compute the magnitude of the first vector",
      explanation:
        "Use numpy's linalg.norm function to compute the magnitude (Euclidean norm) of the first vector.",
      function: "numpy.linalg.norm",
      parameters: {
        x: "previous_result_1",
      },
    },
    {
      step: 5,
      reasoning: "Compute the magnitude of the second vector",
      explanation:
        "Use numpy's linalg.norm function to compute the magnitude (Euclidean norm) of the second vector.",
      function: "numpy.linalg.norm",
      parameters: {
        x: "previous_result_2",
      },
    },
    {
      step: 6,
      reasoning: "Compute the product of the magnitudes of the two vectors",
      explanation:
        "Multiply the magnitudes of the two vectors which is required to calculate the cosine of the angle between them.",
      function: "multiplier",
      parameters: {
        a: "previous_result_4",
        b: "previous_result_5",
      },
    },
    {
      step: 7,
      reasoning: "Compute the cosine of the angle between the vectors",
      explanation:
        "Divide the dot product of the vectors by the product of their magnitudes to find the cosine of the angle between the vectors.",
      function: "divider",
      parameters: {
        a: "previous_result_3",
        b: "previous_result_6",
      },
    },
    {
      step: 8,
      reasoning: "Compute the angle in radians",
      explanation:
        "Use numpy's arccos function to compute the angle in radians from its cosine.",
      function: "numpy.arccos",
      parameters: {
        x: "previous_result_7",
      },
    },
    {
      step: 9,
      reasoning: "Convert the angle from radians to degrees",
      explanation:
        "Multiply the angle in radians by 180/pi to convert it to degrees.",
      function: "multiplier",
      parameters: {
        a: "previous_result_8",
        b: 57.2957795,
      },
    },
  ],
};

interface StepComponentProps {
  step: {
    function: string;
    explanation?: string;
    parameters?: Record<string, any>;
  };
  index: number;
  onParameterChange: (index: number, paramName: string, value: any) => void;
}

const StepComponent = ({
  step,
  index,
  onParameterChange,
}: StepComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div
        className="flex cursor-pointer items-center justify-between p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Step {index + 1}: {step.function}
        </h3>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          {step.explanation && (
            <div className="mb-4">
              <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                Explanation
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {step.explanation}
              </p>
            </div>
          )}

          <div>
            <h4 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Parameters
            </h4>
            <div className="space-y-2">
              {Object.entries(step.parameters || {}).map(([name, value]) => (
                <div key={name} className="flex items-center space-x-2">
                  <label
                    htmlFor={`param-${index}-${name}`}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    {name}:
                  </label>
                  <input
                    id={`param-${index}-${name}`}
                    type="text"
                    value={
                      typeof value === "object" ? JSON.stringify(value) : value
                    }
                    onChange={(e) =>
                      onParameterChange(index, name, e.target.value)
                    }
                    className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Step {
  step: number;
  reasoning: string;
  explanation: string;
  function: string;
  parameters: Record<string, any>;
}

interface TaskData {
  title: string;
  task_summary: string;
  steps: Step[];
}

const NodeDialog = ({
  isOpen,
  onClose,
  step,
  stepIndex,
  onParameterChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  step: Step;
  stepIndex: number;
  onParameterChange: (index: number, paramName: string, value: any) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Step {stepIndex + 1}: {step.function}
          </DialogTitle>
          {step.explanation && (
            <DialogDescription>{step.explanation}</DialogDescription>
          )}
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {Object.entries(step.parameters || {}).map(([name, value]) => (
            <div key={name} className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">{name}:</label>
              <Input
                className="col-span-3"
                value={
                  typeof value === "object" ? JSON.stringify(value) : value
                }
                onChange={(e) =>
                  onParameterChange(stepIndex, name, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function WorkflowPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");
  const [taskData, setTaskData] = useState<TaskData>(staticTaskData);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateWorkflow = async () => {
    // Add your workflow creation logic here
    setShowDialog(false);
    setWorkflowName("");
    setDescription("");
  };

  function getIncomingConnections(step: Step) {
    let count = 0;
    const paramValues = Object.values(step.parameters || {});
    for (const value of paramValues) {
      if (typeof value === "string" && value.includes("previous_result")) {
        count++;
      }
    }
    return count;
  }

  // Calculate incoming connections for each node
  const incomingConnections = taskData.steps.map((step, index) => {
    return getIncomingConnections(step);
  });

  // Create nodes from steps with improved layout
  const initialNodes = taskData.steps.map((step, index) => {
    const dependencies = Object.values(step.parameters || {}).filter(
      (value): value is string =>
        typeof value === "string" && value.startsWith("previous_result_"),
    );

    const dependencyLevel = dependencies.length
      ? Math.max(...dependencies.map((value) => parseInt(value.split("_")[2])))
      : 0;

    // Create parameter string with formatted previous_result references
    const paramString = step.parameters
      ? Object.entries(step.parameters)
          .map(([key, value]) => {
            if (
              typeof value === "string" &&
              value.startsWith("previous_result_")
            ) {
              const stepNum = value.split("_")[2];
              return `${key}: Step ${stepNum}`;
            }
            return `${key}: ${value}`;
          })
          .join("\n")
      : "";

    return {
      id: `${index + 1}`,
      type: "default",
      data: {
        label: (
          <div
            onDoubleClick={() => {
              setSelectedStep(index);
              setIsDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            <p className="font-medium">
              Step {index + 1}: {step.function}
            </p>
            <p className="font-medium">Inputs:</p>
            {paramString && (
              <div className="mt-1 text-xs text-gray-500">{paramString}</div>
            )}
          </div>
        ),
      },
      position: {
        x: index * 180, // Align nodes horizontally
        y:
          incomingConnections[index] > 1
            ? incomingConnections[index] * (index % 2 === 0 ? -1 : 1) * 50
            : 0, // Displace vertically if multiple connections
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  // Create edges between consecutive steps
  const initialEdges = taskData.steps.slice(0, -1).map((_, index) => ({
    id: `e${index + 1}-${index + 2}`,
    source: `${index + 1}`,
    target: `${index + 2}`,
    type: "default",
    animated: true,
  }));

  // Add edges for previous_result dependencies
  taskData.steps.forEach((step, index) => {
    if (step.parameters) {
      Object.values(step.parameters).forEach((value) => {
        if (typeof value === "string" && value.startsWith("previous_result_")) {
          const sourceIndex = parseInt(value.split("_")[2]);
          initialEdges.push({
            id: `e${sourceIndex}-${index + 1}-dep`,
            source: `${sourceIndex}`,
            target: `${index + 1}`,
            type: "default",
            animated: true,
          });
        }
      });
    }
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleParameterChange = (
    stepIndex: number,
    paramName: string,
    value: any,
  ) => {
    setTaskData((prevData) => {
      const newSteps = [...prevData.steps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        parameters: {
          ...newSteps[stepIndex].parameters,
          [paramName]: value,
        },
      };
      return { ...prevData, steps: newSteps };
    });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <Button onClick={() => setShowDialog(true)}>Create Workflow</Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workflow</DialogTitle>
            <DialogDescription>
              Enter the details for your new workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <Input
                id="description"
                placeholder="Enter workflow description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkflow}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add your workflows list/grid here */}
      <div className="">
        <div className="container mx-auto max-w-4xl p-6">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            {taskData.title}
          </h1>

          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
            {taskData.task_summary}
          </p>

          <div className="mb-8 h-[640px] rounded-lg border border-gray-200 dark:border-gray-700">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <Controls />
              <Background />
              <MiniMap style={{ height: 120, width: 120 }} />
            </ReactFlow>
          </div>

          <div className="space-y-4">
            {taskData.steps.map((step, index) => (
              <StepComponent
                key={index}
                step={step}
                index={index}
                onParameterChange={handleParameterChange}
              />
            ))}
          </div>

          {selectedStep !== null && (
            <NodeDialog
              isOpen={isDialogOpen}
              onClose={() => {
                setIsDialogOpen(false);
                setSelectedStep(null);
              }}
              step={taskData.steps[selectedStep]}
              stepIndex={selectedStep}
              onParameterChange={handleParameterChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
