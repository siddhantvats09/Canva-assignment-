export  interface CanvasElement {
    id: string;
    type: 'image' | 'text' | 'video';
    content: string; // URL for images and videos, text for text elements
    x: number; // X position on the canvas
    y: number; // Y position on the canvas
    width: number; // Width of the element
    height: number; // Height of the element
    zIndex: number; // Stacking order
}

export interface CanvasState {
    elements: CanvasElement[];
    undoStack: CanvasElement[][];
    redoStack: CanvasElement[][];
}