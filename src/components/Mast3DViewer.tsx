import { useRef, useState, useCallback } from "react";
import mastImage from "@/assets/mast-3d.png";

const Mast3DViewer = () => {
  const [rotateX, setRotateX] = useState(-5);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setRotateY((prev) => prev + dx * 0.5);
      setRotateX((prev) => Math.max(-30, Math.min(30, prev - dy * 0.3)));
      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.001)));
  }, []);

  return (
    <div
      className="shrink-0 w-44 h-56 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "800px" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={mastImage}
          alt="PTM Light Duty Mast"
          className="h-52 w-auto object-contain pointer-events-none opacity-80"
          draggable={false}
          style={{
            filter: `drop-shadow(${-rotateY * 0.2}px ${3 + rotateX * 0.15}px 8px hsl(var(--primary) / 0.12))`,
          }}
        />
      </div>
    </div>
  );
};

export default Mast3DViewer;
