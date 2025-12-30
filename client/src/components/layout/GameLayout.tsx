import React from 'react';

/**
 * A simple layout component that provides a full‑height container for the game
 * UI.  The component sets a fixed viewport height and uses `overflow-hidden`
 * to prevent the document from scrolling.  This ensures that input fields and
 * other UI elements remain anchored in place regardless of on‑screen
 * keyboards or mode changes.  If additional scrolling behaviour is desired
 * within a child component, that component should implement its own scroll
 * container.
 */
export const GameLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full bg-orange-50 flex flex-col overflow-hidden font-sans text-stone-700">
      {children}
    </div>
  );
};