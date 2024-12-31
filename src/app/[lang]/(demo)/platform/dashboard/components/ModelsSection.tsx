import { useState, useEffect } from "react";
import { ModelTrainingForm } from "./ModelTrainingForm";

interface Dataset {
  id: string;
  name: string;
  description: string;
  last_modified: string;
  samples: number;
}

interface Model {
  name: string;
  description: string;
  status: string;
}

const initialModels: Model[] = [
  {
    name: "Model 1",
    description: "A sample model",
    status: "Training",
  },
];

const sampleDatasets: Dataset[] = [
  {
    id: "1",
    name: "Sample Dataset",
    description: "A sample dataset",
    last_modified: new Date().toISOString(),
    samples: 0,
  },
];

export function ModelsSection() {
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [modelName, setModelName] = useState("");
  const [trainingInstructions, setTrainingInstructions] = useState("");
  const [evaluationMetric, setEvaluationMetric] = useState("Auto");
  const [models, setModels] = useState<Model[]>(initialModels);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Models
        </h2>
        <button
          onClick={() => setIsTrainingModel(true)}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Train New Model
        </button>
      </div>

      {isTrainingModel ? (
        <ModelTrainingForm
          datasets={sampleDatasets}
          modelName={modelName}
          setModelName={setModelName}
          trainingInstructions={trainingInstructions}
          setTrainingInstructions={setTrainingInstructions}
          evaluationMetric={evaluationMetric}
          setEvaluationMetric={setEvaluationMetric}
          onCancel={() => {
            setIsTrainingModel(false);
            setModelName("");
            setTrainingInstructions("");
          }}
          onContinue={async () => {
            // Handle model training submission
            setIsTrainingModel(false);
            setModelName("");
            setTrainingInstructions("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model: Model) => (
            <div
              key={model.name}
              className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {model.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {model.description}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                  {model.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
