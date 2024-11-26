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

export function startModelTraining(model: ModelData) {
  if (model.progress === 0 && !model.startTime) {
    model.startTime = Date.now();
    model.status = "Training";
    model.color = "bg-blue-500";
    
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - model.startTime!;
      const duration = 10000; // 10 seconds
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      model.progress = progress;

      // Update status and color based on progress
      if (progress >= 80 && progress < 100) {
        model.status = "Evaluating";
        model.color = "bg-yellow-500";
      } else if (progress === 100) {
        model.status = "Trained";
        model.color = "bg-green-500";
        clearInterval(intervalId);
        model.intervalId = undefined;
        model.startTime = undefined;
      }
    }, 50);

    model.intervalId = intervalId;
  }
}

export default modelsData;