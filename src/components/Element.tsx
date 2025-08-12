import React, { useRef } from 'react';
import { ElementType } from '.././types';

interface ElementProps {
  element: ElementType;
  onRemove: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDrag: (id: string, x: number, y: number) => void;
}

const Element: React.FC<ElementProps> = ({ element, onRemove, onResize, onDrag }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.width / 2;
      const y = clientY - rect.height / 2;
      onDrag(element.id, x, y);
    }
  };

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const newWidth = e.clientX - elementRef.current!.getBoundingClientRect().left;
    const newHeight = e.clientY - elementRef.current!.getBoundingClientRect().top;
    onResize(element.id, newWidth, newHeight);
  };

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        background: element.type === 'image' ? `url(${element.src})` : 'transparent',
        border: element.type === 'text' ? '1px solid black' : 'none',
        cursor: 'move',
      }}
      draggable
      onDrag={handleDrag}
    >
      {element.type === 'text' && <span>{element.text}</span>}
      {element.type === 'video' && <video src={element.src} controls />}
      <button onClick={() => onRemove(element.id)}>Remove</button>
      <div onMouseDown={handleResize} style={{ cursor: 'nwse-resize', width: '10px', height: '10px', background: 'red', position: 'absolute', bottom: 0, right: 0 }} />
    </div>
  );
};

export default Element;