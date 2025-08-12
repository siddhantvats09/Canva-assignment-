// This file contains helper functions for canvas operations, such as converting the canvas to an image, handling element positioning, and managing the stacking order.

export const toCanvasImage = (canvas: HTMLCanvasElement): string => {
    return canvas.toDataURL('image/png');
};

export const bringForward = (elements: any[], index: number): any[] => {
    if (index < elements.length - 1) {
        const updatedElements = [...elements];
        const [element] = updatedElements.splice(index, 1);
        updatedElements.splice(index + 1, 0, element);
        return updatedElements;
    }
    return elements;
};

export const sendBack = (elements: any[], index: number): any[] => {
    if (index > 0) {
        const updatedElements = [...elements];
        const [element] = updatedElements.splice(index, 1);
        updatedElements.splice(index - 1, 0, element);
        return updatedElements;
    }
    return elements;
};

export const getElementPosition = (element: any, canvasWidth: number, canvasHeight: number): { x: number; y: number } => {
    return {
        x: Math.min(Math.max(element.x, 0), canvasWidth - element.width),
        y: Math.min(Math.max(element.y, 0), canvasHeight - element.height),
    };
};