import React from 'react';

export const GameLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full bg-orange-50 flex flex-col overflow-hidden font-sans text-stone-700">
      {children}
    </div>
  );
};