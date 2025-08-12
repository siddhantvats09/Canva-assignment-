import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import useCanvasActions from "./hooks/useCanvasActions";
import "./App.css";

const App: React.FC = () => {
  const { addElement, removeElement, undo, redo, elements, setElements } =
    useCanvasActions();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onAddImage = (src: string) => {
    addElement({
      id: Date.now().toString(),
      type: "image",
      src,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
    });
  };

  const onAddText = (text: string) => {
    addElement({
      id: Date.now().toString(),
      type: "text",
      text,
      x: 100,
      y: 100,
      width: 100,
      rotation: 0,
    });
  };
  const onAddVideo = (src: string) => {
    addElement({
      id: Date.now().toString(),
      type: "video",
      src,
      x: 100,
      y: 100,
      width: 120,
      height: 80,
      rotation: 0,
    });
  };

  const onUpdateElement = (id: string, updates: Partial<any>) => {
    setElements((elements) =>
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Play/pause video
 const onPlayPauseVideo = (id: string, play: boolean) => {
  const videoEl = document.querySelector(`video[data-id="${id}"]`) as HTMLVideoElement;
  if (videoEl) {
    play ? videoEl.play() : videoEl.pause();
  }
};

 
  const onSendBackward = () => {
    if (!selectedId) return;
    setElements((els) => {
      const idx = els.findIndex((e) => e.id === selectedId);
      if (idx > 0) {
        const newEls = [...els];
        const [item] = newEls.splice(idx, 1);
        newEls.splice(idx - 1, 0, item);
        return newEls;
      }
      return els;
    });
  };

  const onBringForward = () => {
    if (!selectedId) return;
    setElements((els) => {
      const idx = els.findIndex((e) => e.id === selectedId);
      if (idx < els.length - 1 && idx !== -1) {
        const newEls = [...els];
        const [item] = newEls.splice(idx, 1);
        newEls.splice(idx + 1, 0, item);
        return newEls;
      }
      return els;
    });
  };

  

  const handleSelect = (id: string | null) => setSelectedId(id);

  return (
    <div className="app">
      <Toolbar
        onAddImage={onAddImage}
        onAddText={onAddText}
        onAddVideo={onAddVideo}
        onUndo={undo}
        onRedo={redo}
        onRemoveElement={removeElement}
        elements={elements}
        selectedId={selectedId}
        onPlayPauseVideo={onPlayPauseVideo}
        onSendBackward={onSendBackward}
        onBringForward={onBringForward}
      />
      <Canvas
        elements={elements}
        onUpdateElement={onUpdateElement}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default App;
