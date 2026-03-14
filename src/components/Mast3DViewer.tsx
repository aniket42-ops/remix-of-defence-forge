import { useRef, useState, useCallback } from "react";
import mastImage from "@/assets/mast-3d.png";
import { RotateCcw, Move3D } from "lucide-react";

const Mast3DViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handleReset = () => {
    setRotateX(-5);
    setRotateY(0);
    setScale(1);
  };

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
          <Move3D className="h-3.5 w-3.5" />
          3D View
        </span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 bg-muted text-muted-foreground hover:text-foreground text-xs px-2 py-1 rounded transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      <div className="absolute bottom-3 left-3 z-10 text-[10px] uppercase tracking-wider text-muted-foreground">
        Drag to rotate • Scroll to zoom
      </div>

      <div
        ref={containerRef}
        className="h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: "1200px" }}
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
            alt="PTM Light Duty Telescopic Mast - 3D View"
            className="h-[450px] w-auto object-contain pointer-events-none"
            draggable={false}
            style={{
              filter: `drop-shadow(${-rotateY * 0.3}px ${4 + rotateX * 0.2}px 12px hsl(var(--primary) / 0.15))`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Mast3DViewer;
