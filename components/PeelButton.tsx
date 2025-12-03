import React from 'react';
import { motion } from 'framer-motion';

interface PeelButtonProps {
  text: string;
  onClick?: () => void;
  color?: string;
  className?: string;
  fullWidth?: boolean;
}

const PeelButton: React.FC<PeelButtonProps> = ({ 
  text, 
  onClick, 
  color = 'bg-accent-orange', 
  className = '',
  fullWidth = false
}) => {
  return (
    <motion.button
      className={`relative group h-12 ${fullWidth ? 'w-full' : 'w-48'} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background Layer (Text revealed) */}
      <div className={`absolute inset-0 ${color} flex items-center justify-center font-pixel text-xs text-white z-0`}>
        {text}
      </div>

      {/* Top Layer (Paper) */}
      <div className="absolute inset-0 bg-white flex items-center justify-center border-2 border-gray-300 z-10 transition-all duration-300 origin-top-left group-hover:-rotate-6 group-hover:-translate-y-2 group-hover:translate-x-2 shadow-sm group-hover:shadow-lg">
        <span className="font-tech text-black font-bold text-lg uppercase tracking-wider">{text}</span>
      </div>
    </motion.button>
  );
};

export default PeelButton;