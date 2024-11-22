"use client";

import { Stage, Layer, Rect, Image } from "react-konva";
import { useState, useEffect, useRef } from "react";
import useImage from "use-image";

export default function KonvaCanvas({
  annotations,
  setAnnotations,
  selectedId,
  setSelectedId,
  onMouseMove,
  mediaUrl,
  currentFrame,
  isVideo,
}) {
  const [newRect, setNewRect] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentImage, setCurrentImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // For static image
  const [staticImage] = useImage(isVideo ? null : mediaUrl);

  useEffect(() => {
    if (!isVideo) {
      setCurrentImage(staticImage);
    }
  }, [staticImage, isVideo]);

  // Handle video frame extraction
  useEffect(() => {
    if (!isVideo || !mediaUrl) return;

    const video = document.createElement("video");
    video.src = mediaUrl;
    videoRef.current = video;

    video.addEventListener("loadeddata", () => {
      // Create canvas for frame extraction
      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Update frame when currentFrame changes
      updateVideoFrame();
    });
  }, [mediaUrl, isVideo]);

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    updateVideoFrame();
  }, [currentFrame]);

  const updateVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set video to current frame
    video.currentTime = currentFrame;

    // When the video is ready at the new time
    video.addEventListener(
      "seeked",
      () => {
        // Draw the current frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to image
        const frameImage = new Image();
        frameImage.src = canvas.toDataURL();
        frameImage.onload = () => {
          setCurrentImage(frameImage);
        };
      },
      { once: true },
    );
  };

  useEffect(() => {
    const updateSize = () => {
      setStageSize({
        width: window.innerWidth * 0.75,
        height: window.innerHeight - 50, // Account for top toolbar
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Center image when it loads
  useEffect(() => {
    if (currentImage && stageSize.width && stageSize.height) {
      // Calculate center position
      const x = (stageSize.width - currentImage.width) / 2;
      const y = (stageSize.height - currentImage.height) / 2;
      setPosition({ x, y });

      // Optional: Calculate scale to fit image
      const scaleX = stageSize.width / currentImage.width;
      const scaleY = stageSize.height / currentImage.height;
      const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down if needed
      setScale(newScale);
    }
  }, [currentImage, stageSize]);

  const handleMouseDown = (e) => {
    if (newRect) return;
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Call the callback with coordinates
    onMouseMove({
      x: Math.round(pointerPosition.x / scale),
      y: Math.round(pointerPosition.y / scale),
    });

    setNewRect({
      x: pointerPosition.x,
      y: pointerPosition.y,
      width: 0,
      height: 0,
    });
  };

  const handleStageMouseMove = (e) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    // Adjust coordinates to account for image position and scale
    onMouseMove({
      x: Math.round((pointerPosition.x - position.x) / scale),
      y: Math.round((pointerPosition.y - position.y) / scale),
    });

    if (newRect) {
      setNewRect({
        ...newRect,
        width: pointerPosition.x - newRect.x,
        height: pointerPosition.y - newRect.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (newRect) {
      setAnnotations([
        ...annotations,
        { ...newRect, id: Date.now(), label: "" },
      ]);
      setNewRect(null);
    }
  };

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleStageMouseMove}
      onMouseUp={handleMouseUp}
      scale={{ x: scale, y: scale }}
      className="bg-gray-800"
    >
      <Layer>
        {currentImage && (
          <Image
            image={currentImage}
            x={position.x}
            y={position.y}
            width={currentImage.width}
            height={currentImage.height}
          />
        )}
        {/* Annotations need to be adjusted for image position */}
        {annotations.map((anno) => (
          <Rect
            key={anno.id}
            x={position.x + anno.x * scale}
            y={position.y + anno.y * scale}
            width={anno.width}
            height={anno.height}
            fill="rgba(0,0,255,0.2)"
            stroke="blue"
            strokeWidth={2}
            draggable
            onClick={() => setSelectedId(anno.id)}
            onDragEnd={(e) => {
              const index = annotations.findIndex((a) => a.id === anno.id);
              const newAnnotations = [...annotations];
              newAnnotations[index] = {
                ...newAnnotations[index],
                x: (e.target.x() - position.x) / scale,
                y: (e.target.y() - position.y) / scale,
              };
              setAnnotations(newAnnotations);
            }}
          />
        ))}
        {newRect && (
          <Rect
            x={newRect.x}
            y={newRect.y}
            width={newRect.width}
            height={newRect.height}
            fill="rgba(0,255,0,0.2)"
            stroke="green"
            strokeWidth={2}
          />
        )}
      </Layer>
    </Stage>
  );
}
