import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineOptionsUI } from './LineOptionsUI';
import { Save, Download, Trash2, Undo, Redo, Palette } from 'lucide-react';

interface DrawingPoint {
  x: number;
  y: number;
}

interface DrawnLine {
  id: string;
  points: DrawingPoint[];
  lineOption: any;
  timestamp: number;
}

export const VisualContentCreator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLineOption, setCurrentLineOption] = useState(null);
  const [drawnLines, setDrawnLines] = useState<DrawnLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawingPoint[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all lines
    drawnLines.forEach(line => {
      if (line.points.length > 1) {
        drawLine(ctx, line.points, line.lineOption);
      }
    });

    // Draw current line being drawn
    if (currentLine.length > 1 && currentLineOption) {
      drawLine(ctx, currentLine, currentLineOption);
    }
  }, [drawnLines, currentLine, currentLineOption]);

  const drawLine = (ctx: CanvasRenderingContext2D, points: DrawingPoint[], lineOption: any) => {
    if (!lineOption || points.length < 2) return;

    ctx.save();
    
    // Set line properties
    ctx.lineWidth = lineOption.strokeWidth;
    ctx.lineCap = lineOption.strokeLinecap;
    ctx.strokeStyle = getColorValue(lineOption.color);
    
    if (lineOption.strokeDasharray) {
      const dashArray = lineOption.strokeDasharray.split(' ').map(Number);
      ctx.setLineDash(dashArray);
    } else {
      ctx.setLineDash([]);
    }

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    if (lineOption.id === 'zigzag') {
      // Draw zigzag pattern
      for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currentPoint = points[i];
        const segments = 5;
        
        for (let j = 0; j <= segments; j++) {
          const t = j / segments;
          const x = prevPoint.x + (currentPoint.x - prevPoint.x) * t;
          const y = prevPoint.y + (currentPoint.y - prevPoint.y) * t + Math.sin(t * Math.PI * 4) * 10;
          ctx.lineTo(x, y);
        }
      }
    } else {
      // Draw normal line
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  };

  const getColorValue = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'electric-blue': '#00f2ff',
      'neon-green': '#00ff88',
      'hot-pink': '#ff00e5',
      'vivid-purple': '#bd00ff',
      'cyber-yellow': '#fff200',
    };
    return colorMap[colorName] || '#00f2ff';
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentLineOption) return;
    
    setIsDrawing(true);
    const pos = getMousePos(e);
    setCurrentLine([pos]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentLineOption) return;
    
    const pos = getMousePos(e);
    setCurrentLine(prev => [...prev, pos]);
  };

  const stopDrawing = () => {
    if (!isDrawing || currentLine.length < 2) {
      setIsDrawing(false);
      setCurrentLine([]);
      return;
    }
    
    const newLine: DrawnLine = {
      id: Date.now().toString(),
      points: currentLine,
      lineOption: currentLineOption,
      timestamp: Date.now()
    };
    
    setDrawnLines(prev => [...prev, newLine]);
    setCurrentLine([]);
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setDrawnLines([]);
    setCurrentLine([]);
  };

  const undoLastLine = () => {
    setDrawnLines(prev => prev.slice(0, -1));
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'pika-artwork.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-pitch-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
            Visual Content Creator
          </h1>
          <p className="text-white/40 font-medium">
            Create stunning visuals for your social media posts with advanced line tools.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Line Options Sidebar */}
          <div className="lg:col-span-1">
            <LineOptionsUI
              onLineSelect={setCurrentLineOption}
              className="mb-6"
            />
            
            {/* Tools */}
            <div className="glass-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-neon-green/10 border border-neon-green/20 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-neon-green" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                  Tools
                </h3>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={undoLastLine}
                  disabled={drawnLines.length === 0}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Undo className="w-5 h-5 text-white/60" />
                  <span className="text-white/80 font-medium">Undo</span>
                </button>
                
                <button
                  onClick={clearCanvas}
                  disabled={drawnLines.length === 0}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-red-500/20 hover:bg-red-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Trash2 className="w-5 h-5 text-white/60 group-hover:text-red-400" />
                  <span className="text-white/80 font-medium group-hover:text-red-400">Clear All</span>
                </button>
                
                <button
                  onClick={downloadCanvas}
                  disabled={drawnLines.length === 0}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-electric-blue/10 border border-electric-blue/20 rounded-xl hover:border-electric-blue/40 hover:bg-electric-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5 text-electric-blue" />
                  <span className="text-electric-blue font-medium">Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="glass-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">
                    Drawing Canvas
                  </h3>
                  <p className="text-xs font-black uppercase tracking-widest text-white/30">
                    {currentLineOption ? `${currentLineOption.name} Selected` : 'Select a line option to start drawing'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-white/30">
                    Lines Drawn
                  </p>
                  <p className="text-2xl font-black text-white">
                    {drawnLines.length}
                  </p>
                </div>
              </div>
              
              <div className="relative bg-pitch-black border-2 border-white/10 rounded-2xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className={`w-full h-auto ${currentLineOption ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                
                {!currentLineOption && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-center">
                      <Palette className="w-16 h-16 mx-auto mb-4 text-white/40" />
                      <p className="text-white/60 font-medium">
                        Select a line option to start creating
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualContentCreator;