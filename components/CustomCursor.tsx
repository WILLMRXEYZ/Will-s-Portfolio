import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring animation for the cursor
  const springConfig = { damping: 25, stiffness: 700 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.closest('button') || 
        target.closest('.cursor-pointer');
      
      setIsHovering(!!isClickable);
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%'
      }}
    >
        {/* Main Cursor Shape */}
        <motion.div 
            animate={{ 
                scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
                rotate: isHovering ? 45 : 0
            }}
            className="relative flex items-center justify-center"
        >
            {/* Center Dot / Crosshair */}
            <div className={`w-2 h-2 bg-white ${isHovering ? 'rounded-none' : 'rounded-full'}`} />
            
            {/* Outer Ring / Brackets */}
            <div className={`absolute border-2 border-white transition-all duration-200 ${isHovering ? 'w-8 h-8 opacity-100' : 'w-4 h-4 opacity-0'}`} />
            
            {/* Pixel Pointers (Visible when not hovering) */}
            {!isHovering && (
                <>
                    <div className="absolute top-[-10px] w-[2px] h-[6px] bg-white" />
                    <div className="absolute bottom-[-10px] w-[2px] h-[6px] bg-white" />
                    <div className="absolute left-[-10px] w-[6px] h-[2px] bg-white" />
                    <div className="absolute right-[-10px] w-[6px] h-[2px] bg-white" />
                </>
            )}
        </motion.div>
    </motion.div>
  );
};

export default CustomCursor;