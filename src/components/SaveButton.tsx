import React from 'react';

const SaveButton: React.FC<{ canvasRef: React.RefObject<HTMLCanvasElement> }> = ({ canvasRef }) => {
    const handleSave = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = 'canvas.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    return (
        <button onClick={handleSave}>
            Save Canvas
        </button>
    );
};

export default SaveButton;