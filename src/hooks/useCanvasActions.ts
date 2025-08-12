import { useState } from 'react';
import { ElementType } from '../types';

const useCanvasActions = () => {
  const [elements, setElements] = useState<ElementType[]>([]);
  const [history, setHistory] = useState<ElementType[][]>([]);
  const [redoStack, setRedoStack] = useState<ElementType[][]>([]);

  const addElement = (element: ElementType) => {
    setElements(prev => [...prev, element]);
    setHistory(prev => [...prev, [...elements]]);
    setRedoStack([]);
  };

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setHistory(prev => [...prev, [...elements]]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setRedoStack(prev => [...prev, [...elements]]);
      setElements(lastState);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setHistory(prev => [...prev, [...elements]]);
      setElements(nextState);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  return { elements, addElement, removeElement, undo, redo, setElements };
};

export default useCanvasActions;