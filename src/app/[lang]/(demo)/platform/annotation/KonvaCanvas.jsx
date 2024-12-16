"use client";

import { Stage, Layer, Image as KonvaImage, Rect, Line } from "react-konva";
import { useState, useEffect, useRef, useCallback } from "react";
import Konva from "konva";

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

const PolygonAnnotation = ({ annotation, isSelected, onChange, onSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState(annotation.points);

  // Update local points when annotation changes
  useEffect(() => {
    setPoints(annotation.points);
  }, [annotation.points]);

  const handleAnchorDragMove = (e, index) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    // Create new points array with updated position
    const newPoints = [...points];
    newPoints[index * 2] = pos.x;
    newPoints[index * 2 + 1] = pos.y;

    setPoints(newPoints);
    onChange({
      ...annotation,
      points: newPoints,
    });
  };

  return (
    <>
      <Line
        points={points}
        stroke={annotation.color || "#00ff00"}
        strokeWidth={2}
        closed
        onClick={() => onSelect(annotation.id)}
        onTap={() => onSelect(annotation.id)}
        // draggable
        onDragStart={(e) => {
          setIsDragging(true);
          const pos = e.target.getStage().getPointerPosition();
          setLastPos(pos);
        }}
        onDragMove={(e) => {
          if (!isDragging) return;

          const pos = e.target.getStage().getPointerPosition();

          // Calculate the movement delta
          const dx = pos.x - lastPos.x;
          const dy = pos.y - lastPos.y;

          // Update all points
          const newPoints = [...points];
          for (let i = 0; i < newPoints.length; i += 2) {
            newPoints[i] += dx;
            newPoints[i + 1] += dy;
          }

          // Update last position
          setLastPos(pos);

          // Update local points and annotation
          setPoints(newPoints);
          onChange({
            ...annotation,
            points: newPoints,
          });
        }}
        onDragEnd={() => {
          setIsDragging(false);
        }}
      />

      {isSelected &&
        points.length >= 4 &&
        Array.from({ length: points.length / 2 }, (_, i) => (
          <Rect
            key={i}
            x={points[i * 2] - ANCHOR_SIZE / 2}
            y={points[i * 2 + 1] - ANCHOR_SIZE / 2}
            width={ANCHOR_SIZE}
            height={ANCHOR_SIZE}
            fill={ANCHOR_FILL_COLOR}
            stroke={ANCHOR_STROKE_COLOR}
            strokeWidth={1}
            draggable
            onDragMove={(e) => handleAnchorDragMove(e, i)}
            onMouseEnter={(e) => {
              const stage = e.target.getStage();
              stage.container().style.cursor = "pointer";
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
  selectedTool,
}) {
  const [image, setImage] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState(null);
  const [pointAddCounter, setPointAddCounter] = useState(0);

  useEffect(() => {
    if (isVideo) {
      // Handle video
      const video = document.createElement("video");
      video.src = mediaUrl;
      video.crossOrigin = "anonymous";
      videoRef.current = video;

      video.addEventListener("loadedmetadata", () => {
        setSize({
          width: video.videoWidth,
          height: video.videoHeight,
        });

        // Create a canvas to draw the video frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");

        video.addEventListener("seeked", () => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageObj = new window.Image();
          imageObj.src = canvas.toDataURL();
          imageObj.onload = () => {
            setImage(imageObj);
          };
        });

        // Seek to the current frame
        video.currentTime = currentFrame / 30; // Assuming 30fps
      });
    } else {
      // Handle static image
      const imageObj = new window.Image();
      imageObj.src = mediaUrl;
      imageObj.crossOrigin = "anonymous";
      imageObj.onload = () => {
        setImage(imageObj);
        setSize({
          width: imageObj.width,
          height: imageObj.height,
        });
      };
    }
  }, [mediaUrl, isVideo]);

  // Update video frame when currentFrame changes
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = currentFrame / 30; // Assuming 30fps
    }
  }, [currentFrame, isVideo]);

  const handleMouseDown = (e) => {
    // If an annotation is selected, only allow interaction with that annotation
    if (selectedId) {
      const clickedOnStage = e.target === e.target.getStage();
      if (clickedOnStage) {
        // Clicked on empty space - deselect
        setSelectedId(null);
      }
      return;
    }

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    if (selectedTool === "box") {
      setAnnotations([
        ...annotations,
        {
          id: crypto.randomUUID(),
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          type: "box",
        },
      ]);
      setIsDrawing(true);
    } else if (selectedTool === "polygon") {
      setPoints([pos.x, pos.y]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    onMouseMove(pos);

    // Don't draw if an annotation is selected
    if (selectedId) return;
    if (!isDrawing) return;

    if (selectedTool === "box") {
      const lastAnnotation = annotations[annotations.length - 1];
      const newWidth = pos.x - lastAnnotation.x;
      const newHeight = pos.y - lastAnnotation.y;

      setAnnotations(
        annotations.map((anno, i) => {
          if (i === annotations.length - 1) {
            return {
              ...anno,
              width: newWidth,
              height: newHeight,
            };
          }
          return anno;
        }),
      );
    } else if (selectedTool === "polygon") {
      // Add point to polygon every other mouse move
      setPointAddCounter((prev) => prev + 1);
      if (pointAddCounter % 2 === 0) {
        // rate of adding points -> 1/2
        setPoints([...points, pos.x, pos.y]);
      }
    }
  };

  const handleMouseUp = () => {
    // Don't create new annotation if one is selected
    if (selectedId) return;

    if (isDrawing && selectedTool === "polygon" && points.length >= 6) {
      // Close the polygon by adding the first point again
      const closedPoints = [...points, points[0], points[1]];

      // Simplify points by removing points that are too close together
      const simplifiedPoints = simplifyPoints(closedPoints);

      setAnnotations([
        ...annotations,
        {
          id: crypto.randomUUID(),
          points: simplifiedPoints,
          type: "polygon",
        },
      ]);
      setPoints([]);
      setPointAddCounter(0); // Reset counter
    }
    setIsDrawing(false);
  };

  // Helper function to simplify points by removing points that are too close together
  const simplifyPoints = (points) => {
    const minDistance = 5; // Minimum distance between points
    const simplified = [points[0], points[1]];

    for (let i = 2; i < points.length; i += 2) {
      const dx = points[i] - simplified[simplified.length - 2];
      const dy = points[i + 1] - simplified[simplified.length - 1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance >= minDistance) {
        simplified.push(points[i], points[i + 1]);
      }
    }

    // Always add the closing point
    if (simplified.length >= 4) {
      simplified.push(simplified[0], simplified[1]);
    }

    return simplified;
  };

  return (
    <Stage
      width={size.width}
      height={size.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {image && (
          <KonvaImage
            ref={imageRef}
            image={image}
            width={size.width}
            height={size.height}
          />
        )}
        {annotations.map((annotation) => {
          if (annotation.type === "box") {
            return (
              <AnnotationRect
                key={annotation.id}
                annotation={annotation}
                isSelected={selectedId === annotation.id}
                onChange={(newAttrs) => {
                  setAnnotations(
                    annotations.map((a) =>
                      a.id === annotation.id ? { ...a, ...newAttrs } : a,
                    ),
                  );
                }}
                onSelect={(id) => {
                  setSelectedId(id);
                  setIsDrawing(false); // Stop drawing when selecting an annotation
                }}
              />
            );
          } else if (annotation.type === "polygon") {
            return (
              <PolygonAnnotation
                key={annotation.id}
                annotation={annotation}
                isSelected={selectedId === annotation.id}
                onChange={(newAttrs) => {
                  setAnnotations(
                    annotations.map((a) =>
                      a.id === annotation.id ? { ...a, ...newAttrs } : a,
                    ),
                  );
                }}
                onSelect={(id) => {
                  setSelectedId(id);
                  setIsDrawing(false); // Stop drawing when selecting an annotation
                }}
              />
            );
          }
          return null;
        })}
        {/* Only show drawing preview if no annotation is selected */}
        {!selectedId && isDrawing && points.length >= 4 && (
          <Line
            points={points}
            stroke="#00ff00"
            strokeWidth={2}
            closed={false}
          />
        )}
      </Layer>
    </Stage>
  );
}
