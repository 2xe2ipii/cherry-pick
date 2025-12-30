import React, { useState } from 'react';
import { Delete, Check } from 'lucide-react';

interface NumberPadProps {
  onSubmit: (val: number) => void;
  disabled?: boolean;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onSubmit, disabled }) => {
  const [input, setInput] = useState<string>("");

  const handleTap = (num: number) => {
    if (disabled) return;
    
    // Prevent inputs larger than 100
    const newValue = input + num.toString();
    if (Number(newValue) > 100) return;
    
    // Prevent leading zeros (unless it's just "0")
    if (input === "0" && num === 0) return;
    if (input === "0" && num > 0) {
      setInput(num.toString());
      return;
    }

    setInput(newValue);
  };

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!input) return;
    onSubmit(Number(input));
    setInput(""); // Reset after submit
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col gap-4">
      
      {/* The Display Screen */}
      <div className={`
        h-20 bg-stone-100 rounded-3xl flex items-center justify-center border-4
        ${disabled ? 'border-stone-200 opacity-50' : 'border-rose-100 shadow-inner'}
      `}>
        <span className={`text-5xl font-black ${input ? 'text-rose-500' : 'text-stone-300'}`}>
          {input || "_"}
        </span>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleTap(num)}
            disabled={disabled}
            className="h-16 rounded-2xl bg-white shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 text-2xl font-bold text-stone-600 transition-all disabled:opacity-50"
          >
            {num}
          </button>
        ))}

        {/* Bottom Row */}
        <button
          onClick={handleBackspace}
          disabled={disabled}
          className="h-16 rounded-2xl bg-orange-100 text-orange-500 shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Delete size={24} strokeWidth={3} />
        </button>

        <button
          onClick={() => handleTap(0)}
          disabled={disabled}
          className="h-16 rounded-2xl bg-white shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 text-2xl font-bold text-stone-600 transition-all disabled:opacity-50"
        >
          0
        </button>

        <button
          onClick={handleSubmit}
          disabled={disabled || !input}
          className="h-16 rounded-2xl bg-rose-500 text-white shadow-[0_4px_0_rgb(190,18,60,0.3)] active:shadow-none active:translate-y-1 flex items-center justify-center transition-all disabled:bg-stone-300 disabled:shadow-none"
        >
          <Check size={32} strokeWidth={4} />
        </button>
      </div>
    </div>
  );
};