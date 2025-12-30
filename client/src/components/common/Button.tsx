import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth, className, ...props 
}) => {
  const baseStyles = "font-bold py-4 rounded-2xl active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-auto";
  
  const variants = {
    primary: "bg-rose-500 text-white shadow-[0_4px_0_rgb(159,18,57)]",
    secondary: "bg-lime-500 text-white shadow-[0_4px_0_rgb(65,124,19)] hover:bg-lime-400",
    danger: "bg-stone-800 text-white shadow-[0_4px_0_rgb(28,25,23)]",
    ghost: "bg-transparent text-stone-500 shadow-none active:translate-y-0"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
};