"use client";

import { Stage, Layer, Rect, Image } from "react-konva";
import { useState, useEffect, useRef, useCallback } from "react";
import useImage from "use-image";

const ANCHOR_STROKE_COLOR = "#666";
const ANCHOR_FILL_COLOR = "#fff";
const ANCHOR_SIZE = 8;

const getAnchors = (box) => {
  return [
    { x: box.x, y: box.y, cursor: "nw-resize", name: "top-left" },
    { x: box.x + box.width, y: box.y, cursor: "ne-resize", name: "top-right" },
    {
      x: box.x,
      y: box.y + box.height,
      cursor: "sw-resize",
      name: "bottom-left",
    },
    {
      x: box.x + box.width,
      y: box.y + box.height,
      cursor: "se-resize",
      name: "bottom-right",
    },
    {
      x: box.x + box.width / 2,
      y: box.y,
      cursor: "n-resize",
      name: "top-center",
    },
    {
      x: box.x + box.width / 2,
      y: box.y + box.height,
      cursor: "s-resize",
      name: "bottom-center",
    },
    {
      x: box.x,
      y: box.y + box.height / 2,
      cursor: "w-resize",
      name: "middle-left",
    },
    {
      x: box.x + box.width,
      y: box.y + box.height / 2,
      cursor: "e-resize",
      name: "middle-right",
    },
  ];
};

const AnnotationRect = ({ annotation, isSelected, onChange, onSelect }) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleAnchorDragMove = (e, anchorName) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    const box = annotation;
    const pos = stage.getPointerPosition();

    let newBox = { ...box };

    switch (anchorName) {
      case "top-left":
        newBox.width += newBox.x - pos.x;
        newBox.height += newBox.y - pos.y;
        newBox.x = pos.x;
        newBox.y = pos.y;
        break;
      case "top-right":
        newBox.width = pos.x - newBox.x;
        newBox.height += newBox.y - pos.y;
        newBox.y = pos.y;
        break;
      case "bottom-left":
        newBox.width += newBox.x - pos.x;
        newBox.height = pos.y - newBox.y;
        newBox.x = pos.x;
        break;
      case "bottom-right":
        newBox.width = pos.x - newBox.x;
        newBox.height = pos.y - newBox.y;
        break;
      case "top-center":
        newBox.height += newBox.y - pos.y;
        newBox.y = pos.y;
        break;
      case "bottom-center":
        newBox.height = pos.y - newBox.y;
        break;
      case "middle-left":
        newBox.width += newBox.x - pos.x;
        newBox.x = pos.x;
        break;
      case "middle-right":
        newBox.width = pos.x - newBox.x;
        break;
    }

    // Ensure minimum size
    if (newBox.width < 5 || newBox.height < 5) return;

    onChange(newBox);
  };

  return (
    <>
      <Rect
        x={annotation.x}
        y={annotation.y}
        width={annotation.width}
        height={annotation.height}
        stroke={annotation.color || "#00ff00"}
        strokeWidth={2}
        onClick={() => onSelect(annotation.id)}
        onTap={() => onSelect(annotation.id)}
        draggable
        onDragMove={(e) => {
          onChange({
            ...annotation,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
      />

      {/* Render anchors only for selected annotation */}
      {isSelected &&
        getAnchors(annotation).map((anchor, index) => (
          <Rect
            key={index}
            x={anchor.x - ANCHOR_SIZE / 2}
            y={anchor.y - ANCHOR_SIZE / 2}
            width={ANCHOR_SIZE}
            height={ANCHOR_SIZE}
            fill={ANCHOR_FILL_COLOR}
            stroke={ANCHOR_STROKE_COLOR}
            strokeWidth={1}
            draggable
            onDragMove={(e) => handleAnchorDragMove(e, anchor.name)}
            onDragStart={() => setIsResizing(true)}
            onDragEnd={() => setIsResizing(false)}
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              stage.container().style.cursor = anchor.cursor;
            }}
            onMouseLeave={(e) => {
              const stage = e.target.getStage();
              stage.container().style.cursor = "default";
            }}
          />
        ))}
    </>
  );
};

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [mousePos, setMousePos] = useState(null);
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
      { once: true },
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
    const transform = stage.getAbsoluteTransform().copy();
    // Invert the transform to account for scale and position
    transform.invert();
    const pos = stage.getPointerPosition();
    if (!pos) return null;
    // Return transformed point
    return transform.point(pos);
  };

  const handleMouseDown = (e) => {
    if (selectedId || !e.target.getStage()) return;

    const pos = getRelativePointerPosition(e.target.getStage());
    if (!pos) return;

    setIsDrawing(true);
    setStartPos(pos);
    setNewRect({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !e.target.getStage()) return;

    const pos = getRelativePointerPosition(e.target.getStage());
    if (!pos) return;

    setMousePos(pos);

    if (newRect) {
      setNewRect({
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: Math.abs(pos.x - startPos.x),
        height: Math.abs(pos.y - startPos.y),
      });
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;

    setIsDrawing(false);
    if (newRect && newRect.width > 5 && newRect.height > 5) {
      const annotation = {
        ...newRect,
        id: Date.now().toString(),
      };
      setAnnotations([...annotations, annotation]);
    }
    setNewRect(null);
    setStartPos(null);
    setMousePos(null);
  };

  return (
    <div className="relative h-full w-full">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        scale={{ x: scale, y: scale }}
        className={`bg-gray-800 ${selectedId ? "cursor-default" : "cursor-crosshair"}`}
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
          {annotations.map((annotation) => (
            <AnnotationRect
              key={annotation.id}
              annotation={annotation}
              isSelected={selectedId === annotation.id}
              onChange={(newBox) => {
                setAnnotations(
                  annotations.map((a) =>
                    a.id === annotation.id ? { ...a, ...newBox } : a,
                  ),
                );
              }}
              onSelect={setSelectedId}
            />
          ))}
          {newRect && (
            <Rect
              x={newRect.x}
              y={newRect.y}
              width={newRect.width}
              height={newRect.height}
              stroke="#00ff00"
              strokeWidth={2}
              dash={[5, 5]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
