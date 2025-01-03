export interface ModelData {
  name: string;
  status: string;
  accuracy: string;
  lastUpdated: string;
  progress: number;
  color: string;
  link: string;
  startTime?: number;
  intervalId?: ReturnType<typeof setInterval>;
  trainingInstructions?: string;
}

const modelsData: ModelData[] = [
  {
    name: "Sepsis Early Detection 2",
    status: "Training",
    accuracy: "-",
    lastUpdated: "2024-11-04",
    progress: 78,
    color: "bg-blue-500",
    link: "/platform/training/",
  },
  {
    name: "Sleep Apnea Detection",
    status: "Training",
    accuracy: "-",
    lastUpdated: "2024-11-03",
    progress: 67,
    color: "bg-blue-500",
    link: "/platform/training/",
  },
  {
    name: "Pneumonia Predictor v2",
    status: "Evaluating",
    accuracy: "-",
    lastUpdated: "2024-11-02",
    progress: 80,
    color: "bg-yellow-500",
    link: "/platform/training/",
  },
  {
    name: "Pneumonia Predictor v1",
    status: "Trained",
    accuracy: "87.53%",
    lastUpdated: "2024-10-30",
    progress: 100,
    color: "bg-green-500",
    link: "/platform/training/",
  },
  {
    name: "Sepsis Early Detection",
    status: "Trained",
    accuracy: "89.22%",
    lastUpdated: "2024-10-15",
    progress: 100,
    color: "bg-green-500",
    link: "/platform/training-full",
  },
];

let modelUpdateCallbacks: (() => void)[] = [];

export function subscribeToModelUpdates(callback: () => void) {
  modelUpdateCallbacks.push(callback);
  return () => {
    modelUpdateCallbacks = modelUpdateCallbacks.filter(cb => cb !== callback);
  };
}

export function updateModelStatus(modelName: string, updates: Partial<typeof modelsData[0]>) {
  const modelIndex = modelsData.findIndex(m => m.name === modelName);
  if (modelIndex !== -1) {
    modelsData[modelIndex] = {
      ...modelsData[modelIndex],
      ...updates
    };
    // Notify all subscribers of the update
    modelUpdateCallbacks.forEach(callback => callback());
  }
}

export function startModelTraining(model: typeof modelsData[0]) {
  let progress = 0;
  const totalDuration = 20000; // 20 seconds
  const intervalDuration = 50; // Update every 50ms
  const totalSteps = totalDuration / intervalDuration; // Total number of updates
  const increment = 100 / totalSteps; // Increment per update

  const intervalId = setInterval(() => {
    progress += increment;

    // Update status and color based on progress
    let status = "Training";
    let color = "bg-blue-500";

    if (progress >= 80) {
      status = "Evaluating";
      color = "bg-yellow-500";  // Same color as Pneumonia Predictor v2
    }
    if (progress >= 100) {
      status = "Trained";
      color = "bg-green-500";   // Same color as Sepsis Early Detection
      clearInterval(intervalId);
    }

    // Generate random accuracy when training completes
    const accuracy = progress === 100 ? 
      `${(Math.random() * (89 - 86) + 86).toFixed(2)}%` : 
      "-";

    updateModelStatus(model.name, {
      progress: Math.min(progress, 100), // Ensure progress does not exceed 100
      status,
      accuracy,
      color
    });
  }, intervalDuration);
}

export default modelsData;