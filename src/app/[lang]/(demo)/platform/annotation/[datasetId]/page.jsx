"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import VideoControls from "./VideoControls";
import ToolsToolbar from "./ToolsToolbar";
import RightPanel from "./RightPanel";

const KonvaCanvas = dynamic(() => import("./KonvaCanvas"), {
  ssr: false,
  loading: () => <div>Loading canvas...</div>,
});

export default function AnnotationPage({ params }) {
  const searchParams = useSearchParams();
  const sampleId = searchParams.get("sampleId");

  const [currentSampleId, setCurrentSampleId] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [activeTab, setActiveTab] = useState("objects"); // 'objects' | 'labels' | 'issues'
  const [newLabel, setNewLabel] = useState("");
  const [selectedTool, setSelectedTool] = useState("box"); // 'box' | 'polygon'
  const [frameRate, setFrameRate] = useState(30);

  const fetchSampleData = async (sampleId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/samples/${sampleId}`,
        { withCredentials: true },
      );
      setSampleData(response.data);
      if (response.data?.annotations?.length > 0) {
        setAnnotations(response.data.annotations);
      } else {
        setAnnotations([]);
      }
      setCurrentFile(response.data.file);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load sample data");
      setIsLoading(false);
    }
  };

  const fetchDatasetData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/datasets/${params.datasetId}/`,
        { withCredentials: true },
      );
      setDatasetData(response.data);
      if (response.data?.annotations?.length > 0) {
        setAnnotations(response.data.annotations);
      } else {
        setAnnotations([]);
      }
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch dataset data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasetData();
  }, []);

  useEffect(() => {
    if (sampleId && currentSampleId !== null) {
      fetchSampleData(sampleId);
      setCurrentSampleId(sampleId);
    } else if (datasetData?.samples && datasetData?.samples.length > 0) {
      fetchSampleData(datasetData.samples[0]);
      setCurrentSampleId(datasetData.samples[0]);
    }
  }, [params.datasetId, sampleId, datasetData, currentSampleId]);

  useEffect(() => {
    if (!currentFile) return;

    if (currentFile.match(/\.(mp4|webm|ogg)$/i)) {
      setIsVideo(true);
      const video = document.createElement("video");
      video.src = currentFile;
      video.addEventListener("loadedmetadata", () => {
        setTotalFrames(Math.floor(video.duration * frameRate));
      });
    } else {
      setIsVideo(false);
      setTotalFrames(0);
    }
  }, [currentFile, frameRate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">isLoading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleMouseMove = (coords) => {
    setMouseCoords(coords);
  };

  const generateRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEEAD",
      "#D4A5A5",
      "#9B59B6",
      "#3498DB",
      "#E67E22",
      "#2ECC71",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getCurrentSampleIndex = () => {
    if (!datasetData?.samples?.length || !sampleData?.id) return -1;
    return datasetData.samples.indexOf(sampleData.id);
  };

  const getNextSampleId = () => {
    if (!datasetData?.samples?.length) return null;
    const currentIndex = getCurrentSampleIndex();
    if (currentIndex === -1 || currentIndex === datasetData.samples.length - 1)
      return null;
    const newIndex = currentIndex + 1;
    return datasetData.samples[newIndex];
  };

  const getPreviousSampleId = () => {
    if (!datasetData?.samples?.length) return null;
    const currentIndex = getCurrentSampleIndex();
    if (currentIndex <= 0) return null;
    return datasetData.samples[currentIndex - 1];
  };

  const handlePreviousSample = async () => {
    const prevId = getPreviousSampleId();
    if (!prevId) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/samples/${prevId}`,
        { withCredentials: true },
      );
      setSampleData(response.data);
      setAnnotations(response.data.annotations);
      setCurrentFile(response.data.file);
      if (response.data?.annotations?.length > 0) {
        setAnnotations(response.data.annotations); // Reset annotations for new sample
      } else {
        setAnnotations([]);
      }
    } catch (err) {
      setError("Failed to load previous sample");
    }
  };

  const handleNextSample = async () => {
    const nextId = getNextSampleId();
    if (!nextId) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}datasets/samples/${nextId}`,
        { withCredentials: true },
      );
      setSampleData(response.data);
      setCurrentFile(response.data.file);
      if (response.data?.annotations?.length > 0) {
        setAnnotations(response.data.annotations); // Reset annotations for new sample
      } else {
        setAnnotations([]);
      }
    } catch (err) {
      setError("Failed to load next sample");
    }
  };

  if (sampleData == null) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-900">
      <div className="px-4 text-xl font-bold text-gray-900 dark:text-white">
        {datasetData.name}
      </div>
      {/* Top toolbar */}
      <div className="flex items-center space-x-2 border-b border-gray-300 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800">
        {isVideo && (
          <VideoControls
            currentFrame={currentFrame}
            setCurrentFrame={setCurrentFrame}
            totalFrames={totalFrames}
          />
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <ToolsToolbar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />

        {/* Canvas container */}
        <KonvaCanvas
          annotations={annotations}
          setAnnotations={setAnnotations}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onMouseMove={handleMouseMove}
          mediaUrl={sampleData.file}
          currentFrame={currentFrame}
          isVideo={isVideo}
          selectedTool={selectedTool}
        />

        <RightPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sampleData={sampleData}
          handlePreviousSample={handlePreviousSample}
          handleNextSample={handleNextSample}
          getPreviousSampleId={getPreviousSampleId}
          getNextSampleId={getNextSampleId}
          mouseCoords={mouseCoords}
          annotations={annotations}
          setAnnotations={setAnnotations}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          labels={labels}
          setLabels={setLabels}
          newLabel={newLabel}
          setNewLabel={setNewLabel}
          generateRandomColor={generateRandomColor}
        />
      </div>
    </div>
  );
}
