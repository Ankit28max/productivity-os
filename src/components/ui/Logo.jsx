import React from 'react';
import { cn } from '../../utils/cn';

export default function Logo({ className, showText = true, size = 'md' }) {
  const dimensions = {
    xs: { icon: 'h-5 w-5', text: 'text-xs' },
    sm: { icon: 'h-7 w-7', text: 'text-sm' },
    md: { icon: 'h-9 w-9', text: 'text-base' },
    lg: { icon: 'h-12 w-12', text: 'text-xl' },
    xl: { icon: 'h-16 w-16', text: 'text-2xl' },
  };

  const selected = dimensions[size] || dimensions.md;

  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      {/* Sleek SVG Logo Icon with Warm Gradient */}
      <div className={cn('relative flex items-center justify-center shrink-0', selected.icon)}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_8px_rgba(234,88,12,0.25)]">
          {/* Outer segmented telemetry ring */}
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2.5" strokeDasharray="16 8 8 8" className="text-orange-500/30" />
          
          {/* Outer rotating concentric ring */}
          <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="text-orange-500/20" />
          
          {/* Central geometric warm gradient spark / star */}
          <path
            d="M50 16L54.5 40.5L79 45L54.5 49.5L50 74L45.5 49.5L21 45L45.5 40.5L50 16Z"
            fill="url(#logoGradient)"
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />

          {/* Core center node */}
          <circle cx="50" cy="45" r="4.5" fill="#f8fafc" />

          {/* Gradients */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={cn('font-extrabold tracking-tight text-text-primary', selected.text)}>
          Productivity<span className="text-orange-500">OS</span>
        </span>
      )}
    </div>
  );
}
