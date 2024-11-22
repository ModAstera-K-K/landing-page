"use client";

import { Stage, Layer, Rect, Image } from 'react-konva';
import { useState, useEffect, useRef } from 'react';
import useImage from 'use-image';

export default function KonvaCanvas({ annotations, setAnnotations, selectedId, setSelectedId, onMouseMove }) {
  const [newRect, setNewRect] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Load the image
  const [image] = useImage('/images/examples/chest-x-ray-29.jpg');
  
  useEffect(() => {
    const updateSize = () => {
      setStageSize({
        width: window.innerWidth * 0.75,
        height: window.innerHeight - 50 // Account for top toolbar
      });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Center image when it loads
  useEffect(() => {
    if (image && stageSize.width && stageSize.height) {
      // Calculate center position
      const x = (stageSize.width - image.width) / 2;
      const y = (stageSize.height - image.height) / 2;
      setPosition({ x, y });

      // Optional: Calculate scale to fit image
      const scaleX = stageSize.width / image.width;
      const scaleY = stageSize.height / image.height;
      const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down if needed
      setScale(newScale);
    }
  }, [image, stageSize]);

  const handleMouseDown = (e) => {
    if (newRect) return;
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    
    // Call the callback with coordinates
    onMouseMove({
      x: Math.round(pointerPosition.x / scale),
      y: Math.round(pointerPosition.y / scale)
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
      y: Math.round((pointerPosition.y - position.y) / scale)
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
        {image && (
          <Image
            image={image}
            x={position.x}
            y={position.y}
            width={image.width}
            height={image.height}
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