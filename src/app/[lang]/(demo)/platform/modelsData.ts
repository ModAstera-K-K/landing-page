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

export const updateModelAccuracy = (modelName: string, accuracy: string) => {
  const modelIndex = modelsData.findIndex(m => m.name === modelName);
  if (modelIndex !== -1) {
    modelsData[modelIndex] = {
      ...modelsData[modelIndex],
      accuracy: accuracy,
      status: "Trained"
    };
  }
};

export const startModelTraining = (model: any) => {
  const intervalId = setInterval(() => {
    const modelIndex = modelsData.findIndex(m => m.name === model.name);
    if (modelIndex !== -1) {
      const currentProgress = modelsData[modelIndex].progress || 0;
      if (currentProgress < 100) {
        modelsData[modelIndex] = {
          ...modelsData[modelIndex],
          progress: currentProgress + 1
        };
      } else {
        // When training completes, update accuracy
        const randomAccuracy = `${(Math.random() * (89 - 86) + 86).toFixed(2)}%`;
        updateModelAccuracy(model.name, randomAccuracy);
        clearInterval(intervalId);
      }
    } else {
      clearInterval(intervalId);
    }
  }, 50);
};

export default modelsData;