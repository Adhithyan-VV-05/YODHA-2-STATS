import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  variant?: 'default' | 'glow' | 'amber' | 'red';
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  hoverEffect = true
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'glow': return 'glass-panel-glow';
      case 'amber': return 'glass-panel-amber';
      case 'red': return 'glass-panel-red';
      default: return 'glass-panel';
    }
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ${getVariantClass()} ${className}`}
    >
      {/* Corner accent decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/40 pointer-events-none" />

      {children}
    </motion.div>
  );
};
