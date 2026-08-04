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
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.15 } } : undefined}
      className={`rounded-xl p-5 relative overflow-hidden transition-all duration-200 ${getVariantClass()} ${className}`}
    >
      {children}
    </motion.div>
  );
};
