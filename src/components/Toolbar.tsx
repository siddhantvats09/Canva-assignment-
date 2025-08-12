import React, { useState } from 'react';
import { ElementType } from '../types';

type ToolbarProps = {
  onAddImage: (src: string) => void;
  onAddText: (text: string) => void;
  onAddVideo: (src: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onRemoveElement: (id: string) => void;
  elements: ElementType[];
  selectedId: string | null;
  onPlayPauseVideo: (id: string, play: boolean) => void;
  onSendBackward: () => void;
  onBringForward: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  onAddImage,
  onAddText,
  onAddVideo,
  onUndo,
  onRedo,
  onRemoveElement,
  elements,
  selectedId,
  onPlayPauseVideo,
  onSendBackward,
  onBringForward,
}) => {
  const [text, setText] = useState('');

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (typeof ev.target?.result === 'string') {
          onAddImage(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (typeof ev.target?.result === 'string') {
          onAddVideo(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
   <div className="toolbar">
  <input type="file" accept="image/*" onChange={handleImageFile} />
  <button>Add Image</button>

  <input
    type="text"
    placeholder="Text"
    value={text}
    onChange={e => setText(e.target.value)}
  />
  <button onClick={() => { if (text) { onAddText(text); setText(''); } }}>
    Add Text
  </button>

  <input type="file" accept="video/*" onChange={handleVideoFile} />
  <button>Add Video</button>

  <button onClick={onUndo}>Undo</button>
  <button onClick={onRedo}>Redo</button>

  {selectedId && elements.find(e => e.id === selectedId && e.type === 'video') && (
    <>
      <button onClick={() => onPlayPauseVideo(selectedId, true)}>Play</button>
      <button onClick={() => onPlayPauseVideo(selectedId, false)}>Pause</button>
    </>
  )}

  {selectedId && (
    <>
      <button onClick={onSendBackward}>Send Backward</button>
      <button onClick={onBringForward}>Bring Forward</button>
    </>
  )}

  <select onChange={e => onRemoveElement(e.target.value)} defaultValue="">
    <option value="" disabled>Remove Element</option>
    {elements.map(el => (
      <option key={el.id} value={el.id}>
        {el.type} ({el.id})
      </option>
    ))}
  </select>
</div>

  );
};

export default Toolbar;