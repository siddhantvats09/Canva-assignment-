import React, { useRef, useEffect } from "react";
import { ElementType } from "../types";

type CanvasProps = {
  elements: ElementType[];
  onUpdateElement?: (id: string, updates: Partial<ElementType>) => void;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

const HANDLE_SIZE = 10;

const Canvas: React.FC<CanvasProps> = ({
  elements,
  onUpdateElement,
  selectedId,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRefs = useRef<{ [id: string]: HTMLVideoElement }>({});
  const draggingRef = useRef(false);
  const resizingRef = useRef(false);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      ctx.save();
      if (element.type === "image" && element.src) {
        ctx.translate(
          element.x + (element.width || 100) / 2,
          element.y + (element.height || 100) / 2
        );
        ctx.rotate(((element.rotation || 0) * Math.PI) / 180);
        ctx.translate(
          -(element.x + (element.width || 100) / 2),
          -(element.y + (element.height || 100) / 2)
        );

        const img = new window.Image();
        img.src = element.src;
        img.onload = () => {
          ctx.drawImage(
            img,
            element.x,
            element.y,
            element.width || 100,
            element.height || 100
          );
          if (element.id === selectedId) {
            ctx.save();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.strokeRect(
              element.x,
              element.y,
              element.width || 100,
              element.height || 100
            );
            ctx.fillStyle = "red";
            ctx.fillRect(
              element.x + (element.width || 100) - HANDLE_SIZE,
              element.y + (element.height || 100) - HANDLE_SIZE,
              HANDLE_SIZE,
              HANDLE_SIZE
            );
            ctx.restore();
          }
        };
      } else if (element.type === "text" && element.text) {
        ctx.font = "20px Arial";
        ctx.translate(element.x, element.y);
        ctx.rotate(((element.rotation || 0) * Math.PI) / 180);
        ctx.fillText(element.text, 0, 20);
        if (element.id === selectedId) {
          ctx.save();
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;
          const textWidth = ctx.measureText(element.text).width;
          ctx.strokeRect(-5, 0, textWidth + 10, 25);
          ctx.restore();
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      } else if (element.type === "video" && element.src) {
        const width = element.width || 120;
        const height = element.height || 80;
        let video = videoRefs.current[element.id];
        if (!video) {
          video = document.createElement("video");
          video.src = element.src;
          video.autoplay = true;
          video.loop = true;
          video.muted = true;
          video.width = width;
          video.height = height;
          videoRefs.current[element.id] = video;
          video.play();
        }
        ctx.save();
        ctx.translate(element.x + width / 2, element.y + height / 2);
        ctx.rotate(((element.rotation || 0) * Math.PI) / 180);
        ctx.translate(-(element.x + width / 2), -(element.y + height / 2));
        try {
          ctx.drawImage(video, element.x, element.y, width, height);
        } catch {
          ctx.fillStyle = "gray";
          ctx.fillRect(element.x, element.y, width, height);
          ctx.fillStyle = "white";
          ctx.fillText("Video", element.x + 10, element.y + 40);
        }
        if (element.id === selectedId) {
          ctx.save();
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;
          ctx.strokeRect(element.x, element.y, width, height);
          ctx.restore();
        }
        ctx.restore();
      }
      ctx.restore();
    });

    
    const videoIds = elements
      .filter((e) => e.type === "video")
      .map((e) => e.id);
    if (videoIds.length > 0) {
      let animationFrameId: number;
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        elements.forEach((element) => {
          ctx.save();
          if (element.type === "image" && element.src) {
            ctx.translate(
              element.x + (element.width || 100) / 2,
              element.y + (element.height || 100) / 2
            );
            ctx.rotate(((element.rotation || 0) * Math.PI) / 180);
            ctx.translate(
              -(element.x + (element.width || 100) / 2),
              -(element.y + (element.height || 100) / 2)
            );
            const img = new window.Image();
            img.src = element.src;
            ctx.drawImage(
              img,
              element.x,
              element.y,
              element.width || 100,
              element.height || 100
            );
            if (element.id === selectedId) {
              ctx.save();
              ctx.strokeStyle = "blue";
              ctx.lineWidth = 2;
              ctx.strokeRect(
                element.x,
                element.y,
                element.width || 100,
                element.height || 100
              );
              ctx.fillStyle = "red";
              ctx.fillRect(
                element.x + (element.width || 100) - HANDLE_SIZE,
                element.y + (element.height || 100) - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE
              );
              ctx.restore();
            }
          } 
          else if (element.type === "text" && element.text) {
            ctx.font = "20px Arial";
            ctx.translate(element.x, element.y);
            ctx.rotate(((element.rotation || 0) * Math.PI) / 180);

            const textWidth =
              element.width || ctx.measureText(element.text).width;
            ctx.fillText(element.text, 0, 20);

            if (element.id === selectedId) {
              ctx.save();
              ctx.strokeStyle = "blue";
              ctx.lineWidth = 2;
              const textHeight = 25;
              ctx.strokeRect(-5, 0, textWidth + 10, textHeight);

            
              ctx.fillStyle = "red";
              ctx.fillRect(
                textWidth + 5,
                textHeight - HANDLE_SIZE,
                HANDLE_SIZE,
                HANDLE_SIZE
              );
              ctx.restore();
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
          } else if (element.type === "video" && element.src) {
            const width = element.width || 120;
            const height = element.height || 80;
            let video = videoRefs.current[element.id];
            if (!video) {
              video = document.createElement("video");
              video.src = element.src;
              video.autoplay = true;
              video.loop = true;
              video.muted = true;
              video.width = width;
              video.height = height;
              videoRefs.current[element.id] = video;
              video.play();
            }
            ctx.save();
            ctx.translate(element.x + width / 2, element.y + height / 2);
            ctx.rotate(((element.rotation || 0) * Math.PI) / 180);
            ctx.translate(-(element.x + width / 2), -(element.y + height / 2));
            try {
              ctx.drawImage(video, element.x, element.y, width, height);
            } catch {
              ctx.fillStyle = "gray";
              ctx.fillRect(element.x, element.y, width, height);
              ctx.fillStyle = "white";
              ctx.fillText("Video", element.x + 10, element.y + 40);
            }
            if (element.id === selectedId) {
              ctx.save();
              ctx.strokeStyle = "blue";
              ctx.lineWidth = 2;
              ctx.strokeRect(element.x, element.y, width, height);
              ctx.restore();
            }
            ctx.restore();
          }
          ctx.restore();
        });
        animationFrameId = requestAnimationFrame(draw);
      };
      draw();
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [elements, selectedId]);

  //  image selection
  const getImageElementAt = (x: number, y: number) => {
    for (const el of elements) {
      if (el.type === "image") {
        const width = el.width || 100;
        const height = el.height || 100;
        if (x >= el.x && x <= el.x + width && y >= el.y && y <= el.y + height) {
          return el;
        }
      }
    }
    return null;
  };

  // text selection
  const getTextElementAt = (x: number, y: number) => {
    for (const el of elements) {
      if (el.type === "text" && el.text) {
        const width = 100;
        const height = 30;
        if (x >= el.x && x <= el.x + width && y >= el.y && y <= el.y + height) {
          return el;
        }
      }
    }
    return null;
  };

  // video selection
  const getVideoElementAt = (x: number, y: number) => {
    for (const el of elements) {
      if (el.type === "video") {
        const width = el.width || 120;
        const height = el.height || 80;
        if (x >= el.x && x <= el.x + width && y >= el.y && y <= el.y + height) {
          return el;
        }
      }
    }
    return null;
  };

  // Hit test for resize handle (only for images)
  const isOnResizeHandle = (el: ElementType, x: number, y: number) => {
    if (el.type !== "image") return false;
    const width = el.width || 100;
    const height = el.height || 100;
    return (
      x >= el.x + width - HANDLE_SIZE &&
      x <= el.x + width &&
      y >= el.y + height - HANDLE_SIZE &&
      y <= el.y + height
    );
  };

  const isOnVideoResizeHandle = (el: ElementType, x: number, y: number) => {
    if (el.type !== "video") return false;
    const width = el.width || 120;
    const height = el.height || 80;
    return (
      x >= el.x + width - HANDLE_SIZE &&
      x <= el.x + width &&
      y >= el.y + height - HANDLE_SIZE &&
      y <= el.y + height
    );
  };

  const isOnTextResizeHandle = (el: ElementType, x: number, y: number) => {
    if (el.type !== "text" || !el.text) return false;
    const textWidth = el.width || 100;
    const textHeight = 25;
    return (
      x >= el.x + textWidth + 5 &&
      x <= el.x + textWidth + 5 + HANDLE_SIZE &&
      y >= el.y + textHeight - HANDLE_SIZE &&
      y <= el.y + textHeight
    );
  };
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imgEl = getImageElementAt(x, y);
    const textEl = getTextElementAt(x, y);
    const videoEl = getVideoElementAt(x, y);

    if (imgEl) {
      onSelect?.(imgEl.id);
      if (isOnResizeHandle(imgEl, x, y)) {
        resizingRef.current = true;
      } else {
        draggingRef.current = true;
        dragOffsetRef.current = { x: x - imgEl.x, y: y - imgEl.y };
      }
    } else if (textEl) {
      onSelect?.(textEl.id);
      if (isOnTextResizeHandle(textEl, x, y)) {
        resizingRef.current = true;
      } else {
        draggingRef.current = true;
        dragOffsetRef.current = { x: x - textEl.x, y: y - textEl.y };
      }
    } else if (videoEl) {
      onSelect?.(videoEl.id);
      if (isOnVideoResizeHandle(videoEl, x, y)) {
        resizingRef.current = true;
      } else {
        draggingRef.current = true;
        dragOffsetRef.current = { x: x - videoEl.x, y: y - videoEl.y };
      }
    } else {
      onSelect?.(null);
      draggingRef.current = false;
      resizingRef.current = false;
      dragOffsetRef.current = null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedId || !onUpdateElement) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = elements.find((e) => e.id === selectedId);
    if (!el) return;

    if (draggingRef.current && dragOffsetRef.current) {
      onUpdateElement(selectedId, {
        x: x - dragOffsetRef.current.x,
        y: y - dragOffsetRef.current.y,
      });
    } else if (resizingRef.current && el.type === "image") {
      const newWidth = Math.max(20, x - el.x);
      const newHeight = Math.max(20, y - el.y);
      onUpdateElement(selectedId, {
        width: newWidth,
        height: newHeight,
      });
    } else if (resizingRef.current && el.type === "video") {
      const newWidth = Math.max(20, x - el.x);
      const newHeight = Math.max(20, y - el.y);
      onUpdateElement(selectedId, {
        width: newWidth,
        height: newHeight,
      });
    } else if (resizingRef.current && el.type === "text") {
      const newWidth = Math.max(20, x - el.x);
      onUpdateElement(selectedId, {
        width: newWidth,
      });
    }
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    resizingRef.current = false;
    dragOffsetRef.current = null;
  };

 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedId && onUpdateElement) {
        const el = elements.find((e) => e.id === selectedId);
        if (!el) return;
        if (e.key === "r" || e.key === "R") {
          if (
            el.type === "image" ||
            el.type === "text" ||
            el.type === "video"
          ) {
            onUpdateElement(selectedId, {
              rotation: ((el.rotation || 0) + 15) % 360,
            });
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, elements, onUpdateElement]);


  return (
    <>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #ccc", background: "#fff" }}
        onMouseDown={handleMouseDown}
        onMouseMove={
          draggingRef.current || resizingRef.current
            ? handleMouseMove
            : undefined
        }
        onMouseUp={handleMouseUp}
      />
      {elements
        .filter((e) => e.type === "video")
        .map((video) => (
          <video
            key={video.id}
            data-id={video.id}
            src={video.src}
            style={{ display: "none" }}
            autoPlay
            loop
            muted
          />
        ))}
      <button
        style={{ margin: "10px 0"}}
        onClick={() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const url = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = url;
          a.download = "canvas.png";
          a.click();
        }}
      >
        Download Canvas
      </button>
      <button
        style={{ margin: "10px 0" }}
        onClick={async () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const stream = canvas.captureStream(30); // FPS
          const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm",
          });
          const chunks: BlobPart[] = [];
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "canvas.webm";
            a.click();
            URL.revokeObjectURL(url);
          };
          recorder.start();

          setTimeout(() => recorder.stop(), 5000); // You can increase and decreasce the duration
        }}
      >
        Download Canvas as Video
      </button>
    </>
  );
};

export default Canvas;
