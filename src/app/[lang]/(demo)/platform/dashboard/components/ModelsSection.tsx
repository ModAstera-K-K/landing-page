import { useState, useEffect } from "react";
import { ModelTrainingForm } from "./ModelTrainingForm";
import { ModelsTable } from "./ModelsTable";
import datasetsData from "@/app/[lang]/(demo)/platform/datasetsData";
import modelsData from "@/app/[lang]/(demo)/platform/modelsData";
import {
  startModelTraining,
  subscribeToModelUpdates,
} from "@/app/[lang]/(demo)/platform/modelsData"; // Import the shared models data

export function ModelsSection() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [datasetName, setDatasetName] = useState("");
  const [trainingInstructions, setTrainingInstructions] = useState("");
  const [evaluationMetric, setEvaluationMetric] = useState("Auto");
  const [isTrainingModel, setIsTrainingModel] = useState(false); // New state to track if training model block is shown
  const [modelName, setModelName] = useState(""); // Add new state for model name
  const [, forceUpdate] = useState({});
  const [filesToUpload, setFilesToUpload] = useState<
    Array<{
      file: File;
      progress?: number;
      status?: "uploading" | "completed" | "error";
      error?: string;
      dataType?: string;
    }>
  >([]);

  // Subscribe to model updates
  useEffect(() => {
    const unsubscribe = subscribeToModelUpdates(() => {
      forceUpdate({});
    });
    return () => unsubscribe();
  }, []);

  // const handleUploadClick = () => {
  //   setShowUploadForm(true);
  //   setIsTrainingModel(false); // Reset training model state
  // };

  const handleContinueClick = () => {
    // Check if a file is uploaded and a dataset name is provided
    if (!filesToUpload || !datasetName) {
      return; // Do nothing if conditions are not met
    }

    setShowUploadForm(false);
    // Reset the form fields if needed
    setDatasetName("");
    setTrainingInstructions("");
    setEvaluationMetric("Auto");
    setFilesToUpload([]);

    // Append new dataset to datasetsData at the top
    const newDataset = {
      name: datasetName,
      size: `${(Math.random() * 9 + 1).toFixed(1)} GB`, // Random size between 1-10 GB
      lastUpdated: new Date().toISOString().split("T")[0], // Current date
      annotationPath: "/platform/dashboard",
    };
    datasetsData.unshift(newDataset); // Update datasetsData to add at the top
    // Trigger a re-render or state update if necessary
  };

  // New function to handle training model click
  const handleTrainModelClick = () => {
    setIsTrainingModel(true);
    setShowUploadForm(false); // Hide upload form
  };

  // New function to handle cancel action
  const handleCancelClick = () => {
    setIsTrainingModel(false); // Go back to models view
  };

  const handleTrainModelContinue = () => {
    if (!modelName.trim() || !trainingInstructions.trim()) {
      return;
    }

    const newModel = {
      name: modelName,
      status: "Training",
      accuracy: "-",
      lastUpdated: new Date().toISOString().split("T")[0],
      progress: 0,
      color: "bg-blue-500",
      link: "/platform/training",
      trainingInstructions: trainingInstructions,
    };

    modelsData.unshift(newModel);
    startModelTraining(newModel);

    setModelName("");
    setTrainingInstructions("");
    setEvaluationMetric("Auto");
    setIsTrainingModel(false);
  };

  return (
    <>
      {isTrainingModel ? (
        <ModelTrainingForm
          datasets={datasetsData}
          modelName={modelName}
          setModelName={setModelName}
          trainingInstructions={trainingInstructions}
          setTrainingInstructions={setTrainingInstructions}
          evaluationMetric={evaluationMetric}
          setEvaluationMetric={setEvaluationMetric}
          onContinue={handleTrainModelContinue}
          onCancel={handleCancelClick}
        />
      ) : (
        <ModelsTable
          models={modelsData}
          onTrainModelClick={handleTrainModelClick}
        />
      )}
    </>
  );
}