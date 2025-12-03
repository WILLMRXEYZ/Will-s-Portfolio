import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleBurstData {
  id: number;
  x: number;
  y: number;
}

const GlobalClickFx: React.FC = () => {
  const [bursts, setBursts] = useState<ParticleBurstData[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 1. Particle Logic
      const newBurst = { id: Date.now(), x: e.clientX, y: e.clientY };
      setBursts(prev => [...prev, newBurst]);
      
      // Cleanup burst data after animation finishes
      setTimeout(() => {
        setBursts(prev => prev.filter(b => b.id !== newBurst.id));
      }, 1000);

      // 2. Vibration Logic
      const target = e.target as HTMLElement;
      // Traverse up to find if we clicked an interactive element (button, link, etc.)
      const interactiveEl = target.closest('button, a, input, [role="button"], .cursor-pointer, .group');
      
      if (interactiveEl) {
        // Remove class if it exists to restart animation
        interactiveEl.classList.remove('click-shake');
        
        // Force reflow
        void (interactiveEl as HTMLElement).offsetWidth;
        
        // Add class
        interactiveEl.classList.add('click-shake');
        
        // Cleanup class
        setTimeout(() => {
          interactiveEl.classList.remove('click-shake');
        }, 300);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {bursts.map(burst => (
        <ParticleBurst key={burst.id} x={burst.x} y={burst.y} />
      ))}
    </div>
  );
};

const ParticleBurst: React.FC<{ x: number, y: number }> = ({ x, y }) => {
  // Create 10 particles
  const particles = Array.from({ length: 10 });

  return (
    <>
      {particles.map((_, i) => (
        <Particle key={i} x={x} y={y} index={i} total={particles.length} />
      ))}
    </>
  );
};

const Particle: React.FC<{ x: number, y: number, index: number, total: number }> = ({ x, y, index, total }) => {
  // Calculate angle for radial explosion
  const angle = (index / total) * 360;
  // Randomize distance slightly
  const velocity = 40 + Math.random() * 40;
  
  return (
    <motion.div
      initial={{ 
        x: x, 
        y: y, 
        scale: 1, 
        opacity: 1 
      }}
      animate={{ 
        x: x + Math.cos(angle * Math.PI / 180) * velocity, 
        y: y + Math.sin(angle * Math.PI / 180) * velocity, 
        scale: 0, 
        opacity: 0 
      }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut" 
      }}
      className="absolute w-2 h-2 bg-accent-blue shadow-[0_0_8px_#60A5FA]"
    />
  );
};

export default GlobalClickFx;