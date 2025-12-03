import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
}

const AdminFishTrigger: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="absolute bottom-16 left-0 w-full z-30 pointer-events-none overflow-hidden h-20">
      <motion.div
        className="absolute bottom-0 cursor-pointer pointer-events-auto group"
        initial={{ x: -100 }}
        animate={{ x: ['-10vw', '110vw'] }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear",
          repeatDelay: 5
        }}
        onClick={onClick}
        whileHover={{ scale: 1.2, y: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Tooltip */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-accent-blue text-accent-blue text-[8px] font-pixel px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ADMIN LOGIN
        </div>

        {/* Pixel Fish SVG */}
        <div className="w-12 h-8 text-accent-blue drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">
            <svg viewBox="0 0 24 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Simple Pixel Fish Shape */}
                <path d="
                  M4 2 h4 v2 h-4 z
                  M8 0 h8 v2 h-8 z
                  M16 2 h4 v2 h-4 z
                  M18 4 h4 v4 h-4 z
                  M22 8 h2 v4 h-2 z
                  M18 12 h4 v4 h-4 z
                  M16 12 h-4 v2 h4 z
                  M8 14 h8 v2 h-8 z
                  M4 12 h4 v2 h-4 z
                  M0 4 h4 v8 h-4 z
                  M8 4 h2 v2 h-2 z 
                  M8 8 h2 v2 h-2 z
                " />
                {/* Eye */}
                <rect x="14" y="4" width="2" height="2" fill="white" />
            </svg>
        </div>
        
        {/* Bubbles trail */}
        <motion.div 
            animate={{ opacity: [0, 1, 0], x: [-5, -20], y: [0, -10] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-1/2 -left-2 w-1 h-1 bg-white/50"
        />
      </motion.div>
    </div>
  );
};

export default AdminFishTrigger;