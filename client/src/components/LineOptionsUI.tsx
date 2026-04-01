import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Zap, Square, Circle, Triangle } from 'lucide-react';

interface LineOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  strokeWidth: number;
  strokeDasharray?: string;
  strokeLinecap: 'butt' | 'round' | 'square';
  color: string;
}

const lineOptions: LineOption[] = [
  {
    id: 'solid',
    name: 'Solid Line',
    icon: Minus,
    strokeWidth: 2,
    strokeLinecap: 'round',
    color: 'electric-blue'
  },
  {
    id: 'thick',
    name: 'Thick Line',
    icon: Minus,
    strokeWidth: 4,
    strokeLinecap: 'round',
    color: 'neon-green'
  },
  {
    id: 'dashed',
    name: 'Dashed Line',
    icon: Minus,
    strokeWidth: 2,
    strokeDasharray: '8 4',
    strokeLinecap: 'round',
    color: 'hot-pink'
  },
  {
    id: 'dotted',
    name: 'Dotted Line',
    icon: Circle,
    strokeWidth: 2,
    strokeDasharray: '2 6',
    strokeLinecap: 'round',
    color: 'vivid-purple'
  },
  {
    id: 'zigzag',
    name: 'Lightning',
    icon: Zap,
    strokeWidth: 3,
    strokeLinecap: 'round',
    color: 'cyber-yellow'
  }
];

interface LineOptionsUIProps {
  onLineSelect?: (option: LineOption) => void;
  selectedLineId?: string;
  className?: string;
}

export const LineOptionsUI: React.FC<LineOptionsUIProps> = ({ 
  onLineSelect, 
  selectedLineId = 'solid', 
  className = '' 
}) => {
  const [selected, setSelected] = useState(selectedLineId);

  const handleLineSelect = (option: LineOption) => {
    setSelected(option.id);
    onLineSelect?.(option);
  };

  return (
    <div className={`glass-card ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-electric-blue/10 border border-electric-blue/20 rounded-xl flex items-center justify-center">
          <Minus className="w-5 h-5 text-electric-blue" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-white">
          Line Options
        </h2>
      </div>

      <div className="space-y-3">
        {lineOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;
          
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLineSelect(option)}
              className={`w-full p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                isSelected
                  ? `border-${option.color} bg-${option.color}/10 shadow-[0_0_20px_rgba(0,242,255,0.2)]`
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isSelected 
                    ? `bg-${option.color}/20 text-${option.color}` 
                    : 'bg-white/10 text-white/60 group-hover:text-white'
                }`}>
                  <Icon size={16} />
                </div>

                {/* Line Preview */}
                <div className="flex-1 flex items-center">
                  <svg
                    width="120"
                    height="20"
                    viewBox="0 0 120 20"
                    className="mr-4"
                  >
                    <defs>
                      <linearGradient id={`gradient-${option.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={`var(--${option.color})`} />
                        <stop offset="100%" stopColor={`var(--${option.color})`} stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    {option.id === 'zigzag' ? (
                      <path
                        d="M10 10 L25 5 L40 15 L55 5 L70 15 L85 5 L100 15 L110 10"
                        stroke={`url(#gradient-${option.id})`}
                        strokeWidth={option.strokeWidth}
                        strokeLinecap={option.strokeLinecap}
                        fill="none"
                        className={isSelected ? 'drop-shadow-[0_0_8px_currentColor]' : ''}
                      />
                    ) : (
                      <line
                        x1="10"
                        y1="10"
                        x2="110"
                        y2="10"
                        stroke={`url(#gradient-${option.id})`}
                        strokeWidth={option.strokeWidth}
                        strokeDasharray={option.strokeDasharray}
                        strokeLinecap={option.strokeLinecap}
                        className={isSelected ? 'drop-shadow-[0_0_8px_currentColor]' : ''}
                      />
                    )}
                  </svg>
                </div>

                {/* Name */}
                <span className={`text-sm font-bold transition-colors ${
                  isSelected 
                    ? `text-${option.color}` 
                    : 'text-white/60 group-hover:text-white'
                }`}>
                  {option.name}
                </span>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute top-2 right-2 w-3 h-3 bg-${option.color} rounded-full shadow-[0_0_10px_currentColor]`}
                />
              )}

              {/* Hover Glow */}
              <div className={`absolute -inset-1 bg-${option.color}/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            </motion.button>
          );
        })}
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">
          Current Selection
        </p>
        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 bg-${lineOptions.find(o => o.id === selected)?.color}/20 rounded-lg flex items-center justify-center`}>
            <div className={`w-2 h-2 bg-${lineOptions.find(o => o.id === selected)?.color} rounded-full`} />
          </div>
          <span className="text-white font-medium">
            {lineOptions.find(o => o.id === selected)?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LineOptionsUI;