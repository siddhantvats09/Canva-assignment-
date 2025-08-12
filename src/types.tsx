export type ElementType = {
  id: string;
  type: 'image' | 'text' | 'video';
  src?: string;
  text?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number; // Add this line
};