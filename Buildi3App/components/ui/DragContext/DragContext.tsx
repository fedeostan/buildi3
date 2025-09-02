import React, { createContext, useContext, useState, ReactNode } from "react";
import { TaskDragPayload } from "../DraggableTaskRow/types";
import type { TaskStage } from "../TaskRow/types";

interface DragState {
  isDragging: boolean;
  draggedTask: TaskDragPayload | null;
  dragPosition: { x: number; y: number } | null;
}

interface DragContextType {
  dragState: DragState;
  startDrag: (task: TaskDragPayload, position: { x: number; y: number }) => void;
  endDrag: () => void;
  updateDragPosition: (position: { x: number; y: number }) => void;
  onTaskDrop?: (draggedTask: TaskDragPayload, targetStage: TaskStage) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDragContext must be used within a DragProvider");
  }
  return context;
};

interface DragProviderProps {
  children: ReactNode;
  onTaskDrop?: (draggedTask: TaskDragPayload, targetStage: TaskStage) => void;
}

export const DragProvider: React.FC<DragProviderProps> = ({ 
  children, 
  onTaskDrop 
}) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTask: null,
    dragPosition: null,
  });

  const startDrag = (task: TaskDragPayload, position: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      draggedTask: task,
      dragPosition: position,
    });
  };

  const endDrag = () => {
    // Set isDragging to false immediately, but keep draggedTask for drop detection
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      dragPosition: null,
    }));
    
    // Clear draggedTask after a short delay to allow drop detection
    setTimeout(() => {
      setDragState(prev => ({
        ...prev,
        draggedTask: null,
      }));
    }, 100);
  };

  const updateDragPosition = (position: { x: number; y: number }) => {
    setDragState(prev => ({
      ...prev,
      dragPosition: position,
    }));
  };

  return (
    <DragContext.Provider
      value={{
        dragState,
        startDrag,
        endDrag,
        updateDragPosition,
        onTaskDrop,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};