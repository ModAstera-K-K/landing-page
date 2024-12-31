"use client";

import { Stage, Layer, Image as KonvaImage, Rect, Line } from "react-konva";
import { useState, useEffect, useRef, useCallback } from "react";
import Konva from "konva";

const ANCHOR_STROKE_COLOR = "#666";
const ANCHOR_FILL_COLOR = "#fff";
const ANCHOR_SIZE = 8;

const normalizeCoordinates = (x, y, width, height, imageWidth, imageHeight) => {
  return {
    x: (x / imageWidth) * 100,
    y: (y / imageHeight) * 100,
    width: (width / imageWidth) * 100,
    height: (height / imageHeight) * 100,
  };
};

const denormalizeCoordinates = (
  x,
  y,
  width,
  height,
  imageWidth,
  imageHeight,
) => {
  return {
    x: (x * imageWidth) / 100,
    y: (y * imageHeight) / 100,
    width: (width * imageWidth) / 100,
    height: (height * imageHeight) / 100,
  };
};

const normalizePoints = (points, imageWidth, imageHeight) => {
  return points.map(
    (coord, index) =>
      index % 2 === 0
        ? (coord / imageWidth) * 100 // x coordinates
        : (coord / imageHeight) * 100, // y coordinates
  );
};

const denormalizePoints = (points, imageWidth, imageHeight) => {
  return points.map(
    (coord, index) =>
      index % 2 === 0
        ? (coord * imageWidth) / 100 // x coordinates
        : (coord * imageHeight) / 100, // y coordinates
  );
};

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

const AnnotationRect = ({
  annotation,
  isSelected,
  onChange,
  onSelect,
  imageWidth,
  imageHeight,
}) => {
  const [isResizing, setIsResizing] = useState(false);

  // Denormalize coordinates for display
  const displayCoords = denormalizeCoordinates(
    annotation.x,
    annotation.y,
    annotation.width,
    annotation.height,
    imageWidth,
    imageHeight,
  );

  const handleAnchorDragMove = (e, anchorName) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    let newBox = { ...displayCoords };

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

    // Normalize coordinates before saving
    const normalizedBox = normalizeCoordinates(
      newBox.x,
      newBox.y,
      newBox.width,
      newBox.height,
      imageWidth,
      imageHeight,
    );

    onChange({
      ...annotation,
      ...normalizedBox,
    });
  };

  return (
    <>
      <Rect
        x={displayCoords.x}
        y={displayCoords.y}
        width={displayCoords.width}
        height={displayCoords.height}
        stroke={annotation.color || "#00ff00"}
        strokeWidth={2}
        onClick={() => onSelect(annotation.id)}
        onTap={() => onSelect(annotation.id)}
        draggable
        onDragMove={(e) => {
          const normalizedPos = normalizeCoordinates(
            e.target.x(),
            e.target.y(),
            displayCoords.width,
            displayCoords.height,
            imageWidth,
            imageHeight,
          );
          onChange({
            ...annotation,
            x: normalizedPos.x,
            y: normalizedPos.y,
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

const PolygonAnnotation = ({
  annotation,
  isSelected,
  onChange,
  onSelect,
  imageWidth,
  imageHeight,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Denormalize points for display
  const displayPoints = denormalizePoints(
    annotation.points,
    imageWidth,
    imageHeight,
  );

  const handleAnchorDragMove = (e, index) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    const newPoints = [...displayPoints];
    newPoints[index * 2] = pos.x;
    newPoints[index * 2 + 1] = pos.y;

    // Normalize points before saving
    const normalizedPoints = normalizePoints(
      newPoints,
      imageWidth,
      imageHeight,
    );

    onChange({
      ...annotation,
      points: normalizedPoints,
    });
  };

  const handleAnchorRightClick = (e, index) => {
    e.evt.preventDefault(); // Prevent the default context menu
    e.cancelBubble = true;

    // Don't allow deleting if there would be less than 3 points remaining
    if (displayPoints.length <= 6) return; // 6 coordinates = 3 points

    // Remove the clicked point
    const newPoints = [...displayPoints];
    newPoints.splice(index * 2, 2); // Remove x and y coordinates

    // If we're removing the first or last point, connect the polygon properly
    if (index === 0 || index === displayPoints.length / 2 - 1) {
      newPoints[newPoints.length - 2] = newPoints[0];
      newPoints[newPoints.length - 1] = newPoints[1];
    }

    // Normalize points before saving
    const normalizedPoints = normalizePoints(
      newPoints,
      imageWidth,
      imageHeight,
    );

    onChange({
      ...annotation,
      points: normalizedPoints,
    });
  };

  return (
    <>
      <Line
        points={displayPoints}
        stroke={annotation.color || "#00ff00"}
        strokeWidth={2}
        closed
        onClick={() => onSelect(annotation.id)}
        onTap={() => onSelect(annotation.id)}
        onDragStart={(e) => {
          setIsDragging(true);
          const pos = e.target.getStage().getPointerPosition();
          setLastPos(pos);
        }}
        onDragMove={(e) => {
          if (!isDragging) return;

          const pos = e.target.getStage().getPointerPosition();
          const dx = pos.x - lastPos.x;
          const dy = pos.y - lastPos.y;

          const newPoints = [...displayPoints];
          for (let i = 0; i < newPoints.length; i += 2) {
            newPoints[i] += dx;
            newPoints[i + 1] += dy;
          }

          setLastPos(pos);

          // Normalize points before saving
          const normalizedPoints = normalizePoints(
            newPoints,
            imageWidth,
            imageHeight,
          );

          onChange({
            ...annotation,
            points: normalizedPoints,
          });
        }}
        onDragEnd={() => {
          setIsDragging(false);
        }}
      />

      {isSelected &&
        displayPoints.length >= 4 &&
        Array.from({ length: displayPoints.length / 2 }, (_, i) => (
          <Rect
            key={i}
            x={displayPoints[i * 2] - ANCHOR_SIZE / 2}
            y={displayPoints[i * 2 + 1] - ANCHOR_SIZE / 2}
            width={ANCHOR_SIZE}
            height={ANCHOR_SIZE}
            fill={ANCHOR_FILL_COLOR}
            stroke={ANCHOR_STROKE_COLOR}
            strokeWidth={1}
            draggable
            onDragMove={(e) => handleAnchorDragMove(e, i)}
            onContextMenu={(e) => handleAnchorRightClick(e, i)}
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
  const [frameRate, setFrameRate] = useState(30);
  const containerRef = useRef(null);

  // Function to calculate scaled dimensions while maintaining aspect ratio
  const calculateAspectRatioFit = (
    srcWidth,
    srcHeight,
    maxWidth,
    maxHeight,
  ) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
      width: srcWidth * ratio,
      height: srcHeight * ratio,
    };
  };

  useEffect(() => {
    if (isVideo) {
      const video = document.createElement("video");
      video.src = mediaUrl;
      video.crossOrigin = "anonymous";
      videoRef.current = video;

      video.addEventListener("loadedmetadata", () => {
        // Get container dimensions
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scaled dimensions
        const scaledDimensions = calculateAspectRatioFit(
          video.videoWidth,
          video.videoHeight,
          containerWidth,
          containerHeight,
        );

        setSize(scaledDimensions);

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
        video.currentTime = currentFrame / frameRate;
      });
    } else {
      // Handle static image similarly
      const imageObj = new window.Image();
      imageObj.src = mediaUrl;
      imageObj.crossOrigin = "anonymous";
      imageObj.onload = () => {
        // Get container dimensions
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calculate scaled dimensions
        const scaledDimensions = calculateAspectRatioFit(
          imageObj.width,
          imageObj.height,
          containerWidth,
          containerHeight,
        );

        setSize(scaledDimensions);
        setImage(imageObj);
      };
    }
  }, [mediaUrl, isVideo, frameRate, currentFrame]);

  // Add resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!image) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const scaledDimensions = calculateAspectRatioFit(
        image.width || image.videoWidth,
        image.height || image.videoHeight,
        containerWidth,
        containerHeight,
      );

      setSize(scaledDimensions);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [image]);

  // Add back the effect for updating video frame
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = currentFrame / frameRate;
    }
  }, [currentFrame, isVideo, frameRate]);

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

    // Ensure we have valid coordinates
    if (!pos || typeof pos.x !== "number" || typeof pos.y !== "number") {
      return;
    }

    if (selectedTool === "box") {
      // Normalize coordinates before saving
      const normalizedCoords = normalizeCoordinates(
        pos.x,
        pos.y,
        0,
        0,
        size.width,
        size.height,
      );

      const newAnnotation = {
        id: crypto.randomUUID(),
        ...normalizedCoords,
        type: "box",
        frame: isVideo ? currentFrame : undefined,
      };

      setAnnotations([...annotations, newAnnotation]);
      setIsDrawing(true);
    } else if (selectedTool === "polygon") {
      // Use raw coordinates during drawing
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
      // Check if lastAnnotation exists and has the required properties
      if (
        !lastAnnotation ||
        typeof lastAnnotation.x !== "number" ||
        typeof lastAnnotation.y !== "number"
      ) {
        return;
      }

      // Denormalize the last annotation's coordinates
      const denormalizedLastAnnotation = denormalizeCoordinates(
        lastAnnotation.x,
        lastAnnotation.y,
        lastAnnotation.width || 0,
        lastAnnotation.height || 0,
        size.width,
        size.height,
      );

      // Calculate new width and height in pixels
      const newWidth = pos.x - denormalizedLastAnnotation.x;
      const newHeight = pos.y - denormalizedLastAnnotation.y;

      // Normalize the new width and height
      const normalizedDimensions = normalizeCoordinates(
        denormalizedLastAnnotation.x,
        denormalizedLastAnnotation.y,
        newWidth,
        newHeight,
        size.width,
        size.height,
      );

      setAnnotations(
        annotations.map((anno, i) => {
          if (i === annotations.length - 1) {
            return {
              ...anno,
              width: normalizedDimensions.width,
              height: normalizedDimensions.height,
            };
          }
          return anno;
        }),
      );
    } else if (selectedTool === "polygon") {
      setPointAddCounter((prev) => prev + 1);
      if (pointAddCounter % 2 === 0) {
        // Add points in pixel coordinates during drawing
        setPoints([...points, pos.x, pos.y]);
      }
    }
  };

  const handleMouseUp = () => {
    // Don't create new annotation if one is selected
    if (selectedId) return;

    if (isDrawing && selectedTool === "polygon" && points.length >= 6) {
      const closedPoints = [...points, points[0], points[1]];
      const simplifiedPoints = simplifyPoints(closedPoints);

      // Only normalize points when creating the final annotation
      const normalizedPoints = normalizePoints(
        simplifiedPoints,
        size.width,
        size.height,
      );

      setAnnotations([
        ...annotations,
        {
          id: crypto.randomUUID(),
          points: normalizedPoints,
          type: "polygon",
          frame: isVideo ? currentFrame : undefined,
        },
      ]);
      setPoints([]);
      setPointAddCounter(0);
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
    <div
      ref={containerRef}
      className="flex items-center justify-center overflow-hidden"
      style={{ width: "100%", height: "100%" }}
    >
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
                    setIsDrawing(false);
                  }}
                  imageWidth={size.width}
                  imageHeight={size.height}
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
                    setIsDrawing(false);
                  }}
                  imageWidth={size.width}
                  imageHeight={size.height}
                />
              );
            }
            return null;
          })}
          {/* Only show drawing preview if no annotation is selected */}
          {!selectedId && isDrawing && points.length >= 4 && (
            <Line
              points={points} // Use raw pixel coordinates for preview
              stroke="#00ff00"
              strokeWidth={2}
              closed={false}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
