"use client";

import { Stage, Layer, Rect, Image } from "react-konva";
import { useState, useEffect, useRef, useCallback } from "react";
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

  // 1. First define updateVideoFrame
  const updateVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    video.currentTime = currentFrame;

    video.addEventListener(
      "seeked",
      () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameImage = new Image();
        frameImage.src = canvas.toDataURL();
        frameImage.onload = () => {
          setCurrentImage(frameImage);
        };
      },
      { once: true }
    );
  }, [currentFrame]);

  // 2. Then use it in useEffect hooks
  useEffect(() => {
    if (!isVideo || !mediaUrl) return;

    const video = document.createElement("video");
    video.src = mediaUrl;
    videoRef.current = video;

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      updateVideoFrame();
    });
  }, [mediaUrl, isVideo, updateVideoFrame]);

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    updateVideoFrame();
  }, [currentFrame, isVideo, updateVideoFrame]);

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

  const getRelativePointerPosition = (stage) => {
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition || !currentImage) return null;

    // Calculate coordinates relative to the image
    const x = (pointerPosition.x - position.x) / scale;
    const y = (pointerPosition.y - position.y) / scale;

    // Check if the point is within image bounds
    if (x < 0 || x > currentImage.width || y < 0 || y > currentImage.height) {
      return null;
    }

    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (newRect) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = getRelativePointerPosition(stage);
    if (!pos) return; // Don't start drawing if outside image

    setNewRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    if (!stage || !currentImage) return;

    // Update mouse coordinates for display
    const pos = getRelativePointerPosition(stage);
    if (pos) {
      onMouseMove({
        x: Math.round(pos.x),
        y: Math.round(pos.y)
      });
    }

    // Handle rectangle drawing
    if (newRect) {
      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      // Calculate new width and height
      let newWidth = (pointerPos.x - position.x) / scale - newRect.x;
      let newHeight = (pointerPos.y - position.y) / scale - newRect.y;

      // Constrain rectangle within image bounds
      if (newRect.x + newWidth > currentImage.width) {
        newWidth = currentImage.width - newRect.x;
      }
      if (newRect.y + newHeight > currentImage.height) {
        newHeight = currentImage.height - newRect.y;
      }
      if (newRect.x + newWidth < 0) {
        newWidth = -newRect.x;
      }
      if (newRect.y + newHeight < 0) {
        newHeight = -newRect.y;
      }

      setNewRect({
        ...newRect,
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleMouseUp = () => {
    if (newRect) {
      // Only add annotation if it has positive dimensions
      if (Math.abs(newRect.width) > 1 && Math.abs(newRect.height) > 1) {
        // Normalize rectangle coordinates (handle negative width/height)
        const normalizedRect = {
          x: newRect.width < 0 ? newRect.x + newRect.width : newRect.x,
          y: newRect.height < 0 ? newRect.y + newRect.height : newRect.y,
          width: Math.abs(newRect.width),
          height: Math.abs(newRect.height),
          id: Date.now(),
          label: "",
        };
        setAnnotations([...annotations, normalizedRect]);
      }
      setNewRect(null);
    }
  };

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
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
            alt=""
          />
        )}
        {annotations.map((anno) => (
          <Rect
            key={anno.id}
            x={position.x + anno.x * scale}
            y={position.y + anno.y * scale}
            width={anno.width * scale}
            height={anno.height * scale}
            fill="rgba(0,0,255,0.2)"
            stroke={anno.color || '#00ff00'}
            strokeWidth={2}
            draggable
            onClick={() => setSelectedId(anno.id)}
            onDragMove={(e) => {
              // Constrain drag within image bounds
              const rect = e.target;
              const x = (rect.x() - position.x) / scale;
              const y = (rect.y() - position.y) / scale;
              
              if (x < 0) rect.x(position.x);
              if (y < 0) rect.y(position.y);
              if (x + anno.width > currentImage.width) {
                rect.x(position.x + (currentImage.width - anno.width) * scale);
              }
              if (y + anno.height > currentImage.height) {
                rect.y(position.y + (currentImage.height - anno.height) * scale);
              }
            }}
            onDragEnd={(e) => {
              const x = (e.target.x() - position.x) / scale;
              const y = (e.target.y() - position.y) / scale;
              
              const index = annotations.findIndex((a) => a.id === anno.id);
              const newAnnotations = [...annotations];
              newAnnotations[index] = {
                ...newAnnotations[index],
                x: Math.max(0, Math.min(x, currentImage.width - anno.width)),
                y: Math.max(0, Math.min(y, currentImage.height - anno.height)),
              };
              setAnnotations(newAnnotations);
            }}
          />
        ))}
        {newRect && (
          <Rect
            x={position.x + newRect.x * scale}
            y={position.y + newRect.y * scale}
            width={newRect.width * scale}
            height={newRect.height * scale}
            fill="rgba(0,255,0,0.2)"
            stroke="green"
            strokeWidth={2}
          />
        )}
      </Layer>
    </Stage>
  );
}
