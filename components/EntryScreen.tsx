
import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Particle } from '../types';

interface Props {
  onEnter: () => void;
}

// Extended particle for 3D effect
interface Star extends Particle {
  z: number;
  ox: number; // Original X (for reset)
  oy: number; // Original Y
}

const EntryScreen: React.FC<Props> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showButton, setShowButton] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isConverging, setIsConverging] = useState(false);
  
  const requestRef = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);

  const initStars = (width: number, height: number) => {
    const s: Star[] = [];
    // Create 3D Starfield
    for (let i = 0; i < 1500; i++) {
      const x = (Math.random() - 0.5) * width * 2;
      const y = (Math.random() - 0.5) * height * 2;
      s.push({
        x: x,
        y: y,
        z: Math.random() * width,
        ox: x,
        oy: y,
        vx: 0,
        vy: 0,
        size: 1,
        color: Math.random() > 0.6 ? (Math.random() > 0.5 ? '#60A5FA' : '#F97316') : '#ffffff'
      });
    }
    return s;
  };

  const drawPixelCircle = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string) => {
    ctx.fillStyle = color;
    // Draw a circle using small rectangles to simulate pixels
    const circumference = 2 * Math.PI * radius;
    const pixelCount = Math.floor(circumference / 4); // 4px spacing
    
    for(let i = 0; i < pixelCount; i++) {
        const angle = (i / pixelCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        ctx.fillRect(x, y, 3, 3);
    }
  };

  const update = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Clear with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const distMouse = Math.sqrt(Math.pow(mousePos.current.x - centerX, 2) + Math.pow(mousePos.current.y - centerY, 2));
    
    // Trigger Convergence
    if (distMouse < 200 && !showButton && !isConverging && !isExploding) {
        setIsConverging(true);
        setTimeout(() => setShowButton(true), 800);
    }

    starsRef.current.forEach(p => {
        // --- MOVEMENT LOGIC ---
        if (isExploding) {
            // INTERSTELLAR WARP
            // 1. Move Z fast towards camera
            p.z -= 40;
            
            // 2. Expand X/Y radially to simulate passing through
            const dx = p.x;
            const dy = p.y;
            const angle = Math.atan2(dy, dx);
            
            // Accelerate outwards
            p.x += Math.cos(angle) * (Math.abs(p.x) * 0.05 + 5);
            p.y += Math.sin(angle) * (Math.abs(p.y) * 0.05 + 5);
            
            // Recycle if passed camera to keep the stream going
            if (p.z <= 10) {
                 p.z = canvas.width;
            }

        } else if (isConverging) {
            // CONVERGENCE: Suck into black hole
            p.x = p.x * 0.92;
            p.y = p.y * 0.92;
            p.z = p.z * 0.95; 

            // Jitter
            p.x += (Math.random() - 0.5) * 5;
            p.y += (Math.random() - 0.5) * 5;

        } else {
            // IDLE: Warp Drive Forward
            const speed = 5;
            p.z -= speed;
            if (p.z <= 0) {
                p.z = canvas.width;
                p.x = (Math.random() - 0.5) * canvas.width * 2;
                p.y = (Math.random() - 0.5) * canvas.height * 2;
            }
        }

        // --- RENDER LOGIC ---
        const k = 128.0 / Math.max(0.1, p.z);
        const px = p.x * k + centerX;
        const py = p.y * k + centerY;

        // Render if within reasonable bounds
        if (px >= -100 && px <= canvas.width + 100 && py >= -100 && py <= canvas.height + 100) {
            let size = (1 - p.z / canvas.width) * 4;
            let alpha = 1 - p.z / canvas.width;
            
            if (isExploding) {
                size *= 2; 
                alpha = 1;
                
                // Draw Streak (Warp Line)
                ctx.beginPath();
                ctx.moveTo(px, py);
                // Tail towards center
                const tailX = centerX + (px - centerX) * 0.85; 
                const tailY = centerY + (py - centerY) * 0.85;
                ctx.lineTo(tailX, tailY);
                
                ctx.strokeStyle = p.color;
                ctx.lineWidth = Math.max(1, size);
                ctx.globalAlpha = 0.8;
                ctx.stroke();
                ctx.globalAlpha = 1.0;

            } else if (isConverging) {
                 // Make them look like energy sparks
                 ctx.fillStyle = Math.random() > 0.5 ? '#60A5FA' : '#F97316';
                 size = Math.random() * 3;
                 ctx.globalAlpha = alpha;
                 ctx.fillRect(px, py, size, size);
                 ctx.globalAlpha = 1.0;
            } else {
                 ctx.fillStyle = p.color;
                 ctx.globalAlpha = alpha;
                 ctx.fillRect(px, py, size, size);
                 ctx.globalAlpha = 1.0;
            }
        }
    });

    // Central UI
    if (!isExploding) {
        if (!showButton && !isConverging) {
            // Idle Orbit UI
            const time = Date.now() / 1000;
            drawPixelCircle(ctx, centerX, centerY, 60, 'rgba(255,255,255,0.5)');
            
            const orbitRadius = 60;
            const orbitSpeed = 3;
            const particleX = centerX + Math.cos(time * orbitSpeed) * orbitRadius;
            const particleY = centerY + Math.sin(time * orbitSpeed) * orbitRadius;

            ctx.fillStyle = '#60A5FA';
            ctx.shadowColor = '#60A5FA';
            ctx.shadowBlur = 15;
            ctx.fillRect(particleX - 4, particleY - 4, 8, 8);
            ctx.shadowBlur = 0;
        } else if (isConverging && !showButton) {
            // Draw Singularity
            ctx.beginPath();
            ctx.arc(centerX, centerY, 10 + Math.random() * 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
    }

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            starsRef.current = initStars(window.innerWidth, window.innerHeight);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    requestRef.current = requestAnimationFrame(update);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [showButton, isExploding, isConverging]);

  const handleEnterClick = () => {
      setIsExploding(true);
      setShowButton(false);
      setTimeout(() => {
          onEnter();
      }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-transparent overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0" />
        
        {/* Overlay Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_20%,#000000_100%)]"></div>

        <AnimatePresence>
            {showButton && !isExploding && (
                <motion.div 
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <button 
                        onClick={handleEnterClick}
                        className="pointer-events-auto group relative"
                    >
                        <div className="absolute inset-0 bg-accent-blue blur-xl opacity-60 group-hover:opacity-100 animate-pulse"></div>
                        <motion.div 
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            className="relative bg-black/80 border-4 border-accent-blue text-accent-blue font-pixel px-8 py-4 text-xl hover:bg-accent-blue hover:text-black transition-all flex items-center gap-4"
                        >
                            <span>ENTER_SYSTEM</span>
                        </motion.div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default EntryScreen;
