import React, { useState } from 'react';
import { Delete, Check } from 'lucide-react';

interface NumberPadProps {
  onSubmit: (val: number) => void;
  disabled?: boolean;
}

/**
 * A numeric keypad for submitting guesses during gameplay.
 *
 * Maintains its own input state and enforces simple constraints such as
 * limiting the value to a maximum of 100 and preventing leading zeros.
 * The pad emits the number via the onSubmit callback when the check
 * button is pressed.
 */
export const NumberPad: React.FC<NumberPadProps> = ({ onSubmit, disabled }) => {
  const [input, setInput] = useState<string>('');

  const handleTap = (num: number) => {
    if (disabled) return;
    const newValue = input + num.toString();
    if (Number(newValue) > 100) return; // Cap at 100
    if (input === '0' && num === 0) return; // No 00
    if (input === '0' && num > 0) {
      setInput(num.toString());
      return;
    }
    setInput(newValue);
  };

  const handleBackspace = () => setInput(prev => prev.slice(0, -1));

  const handleSubmit = () => {
    if (!input) return;
    onSubmit(Number(input));
    setInput('');
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4 select-none">
      {/* The Display (Floating Numbers) */}
      <div className="h-24 flex items-center justify-center">
        <span
          className={`
            text-7xl font-black transition-all duration-300
            ${disabled ? 'text-stone-300 scale-90 blur-[2px]' : 'text-rose-500 scale-100'}
          `}
        >
          {input || <span className="opacity-20">0</span>}
        </span>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-3 gap-3 px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleTap(num)}
            disabled={disabled}
            className="
              h-20 rounded-[2rem] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]
              text-3xl font-black text-stone-600 transition-transform active:scale-90
              disabled:opacity-50 disabled:active:scale-100 touch-manipulation
            "
          >
            {num}
          </button>
        ))}

        {/* Bottom Row */}
        <button
          onClick={handleBackspace}
          disabled={disabled}
          className="
            h-20 rounded-[2rem] bg-stone-100 text-stone-400 flex items-center justify-center
            transition-transform active:scale-90 disabled:opacity-30 disabled:active:scale-100 touch-manipulation
          "
        >
          <Delete size={28} strokeWidth={3} />
        </button>

        <button
          onClick={() => handleTap(0)}
          disabled={disabled}
          className="
            h-20 rounded-[2rem] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]
            text-3xl font-black text-stone-600 transition-transform active:scale-90
            disabled:opacity-50 disabled:active:scale-100 touch-manipulation
          "
        >
          0
        </button>

        <button
          onClick={handleSubmit}
          disabled={disabled || !input}
          className={`
            h-20 rounded-[2rem] flex items-center justify-center shadow-lg transition-transform active:scale-90 disabled:opacity-50 disabled:active:scale-100
            ${!input ? 'bg-stone-200 text-stone-400' : 'bg-rose-500 text-white shadow-rose-200'}
          `}
        >
          <Check size={32} strokeWidth={4} />
        </button>
      </div>
    </div>
  );
};