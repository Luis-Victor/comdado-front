import React from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  formatValue = (val) => val.toString(),
}: RangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1] - step);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0] + step);
    onChange([value[0], newMax]);
  };

  // Calculate percentage for background gradient
  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="w-full px-4"> {/* Increased padding */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative pt-2 pb-6"> {/* Increased padding */}
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-primary-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
        </div>

        {/* Range inputs with higher z-index */}
        <div className="relative z-20"> {/* Added z-index container */}
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            step={step}
            onChange={handleMinChange}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />

          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            step={step}
            onChange={handleMaxChange}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
          />

          {/* Thumbs with higher z-index */}
          <div
            className="absolute h-4 w-4 -mt-3 bg-white border-2 border-primary-500 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
            style={{ left: `${minPercent}%` }}
          />
          <div
            className="absolute h-4 w-4 -mt-3 bg-white border-2 border-primary-500 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
            style={{ left: `${maxPercent}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-sm text-gray-600">{formatValue(value[0])}</span>
        <span className="text-sm text-gray-600">{formatValue(value[1])}</span>
      </div>
    </div>
  );
}