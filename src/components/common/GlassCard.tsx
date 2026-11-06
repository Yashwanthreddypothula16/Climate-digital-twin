import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  borderHover?: boolean;
  padding?: string;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  borderHover = true,
  padding = 'p-3',
  onClick,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={clsx(
        'relative rounded-xl overflow-hidden transition-all duration-300',
        'bg-[#0a1638]/75 backdrop-blur-md',
        'border border-[#00f0ff]/15',
        glow && 'border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]',
        borderHover && 'hover:border-[#00f0ff]/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]',
        padding,
        className
      )}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Subtle top specular highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
