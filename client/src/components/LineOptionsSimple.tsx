import React, { useState } from 'react';

const LineOptionsSimple = ({ onLineSelect, selectedLineId = 'solid' }) => {
  const [selected, setSelected] = useState(selectedLineId);

  const lineOptions = [
    {
      id: 'solid',
      name: 'Solid Line',
      strokeWidth: 2,
      strokeDasharray: '',
      color: '#00f2ff'
    },
    {
      id: 'thick',
      name: 'Thick Line', 
      strokeWidth: 4,
      strokeDasharray: '',
      color: '#00ff88'
    },
    {
      id: 'dashed',
      name: 'Dashed Line',
      strokeWidth: 2,
      strokeDasharray: '8 4',
      color: '#ff00e5'
    },
    {
      id: 'dotted',
      name: 'Dotted Line',
      strokeWidth: 2,
      strokeDasharray: '2 6', 
      color: '#bd00ff'
    },
    {
      id: 'thick-dashed',
      name: 'Thick Dashed',
      strokeWidth: 4,
      strokeDasharray: '12 6',
      color: '#fff200'
    }
  ];

  const handleLineSelect = (option) => {
    setSelected(option.id);
    onLineSelect?.(option);
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="8" x2="14" y2="8" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Line Options
      </h3>
      
      <div className="space-y-3">
        {lineOptions.map((option) => {
          const isSelected = selected === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleLineSelect(option)}
              className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                isSelected
                  ? 'border-white/30 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-white' : 'text-white/70'
                }`}>
                  {option.name}
                </span>
                
                <svg width="60" height="16" viewBox="0 0 60 16">
                  <line
                    x1="5"
                    y1="8"
                    x2="55"
                    y2="8"
                    stroke={option.color}
                    strokeWidth={option.strokeWidth}
                    strokeDasharray={option.strokeDasharray}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                    <span>Width: {option.strokeWidth}px</span>
                    {option.strokeDasharray && (
                      <span>• Pattern: {option.strokeDasharray}</span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LineOptionsSimple;