import React, { useEffect, useRef } from 'react';

const PixelBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Type definitions
    type Particle = { x: number; y: number; s: number; vy: number; vx: number; c: string };
    type Bubble = { x: number; y: number; size: number; speed: number; wobbleOffset: number; amplitude: number };

    let particles: Particle[] = [];
    let bubbles: Bubble[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Init Particles (Stars/Dust)
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000); 
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          s: Math.random() > 0.9 ? 4 : 2, 
          vy: -Math.random() * 0.5 - 0.1, 
          vx: (Math.random() - 0.5) * 0.2, 
          c: Math.random() > 0.8 ? '#1e3a8a' : '#172554' 
        });
      }

      // Init Bubbles (Rising Pixel Circles)
      bubbles = [];
      const bubbleCount = Math.floor(canvas.width / 100); // Density based on width
      for (let i = 0; i < bubbleCount; i++) {
          bubbles.push(createBubble(canvas.width, canvas.height, true));
      }
    };

    const createBubble = (w: number, h: number, randomY: boolean = false): Bubble => {
        return {
            x: Math.random() * w,
            y: randomY ? Math.random() * h : h + 20,
            size: Math.random() > 0.5 ? 8 : 12 + Math.random() * 8, // Varying sizes
            speed: 0.5 + Math.random() * 1.5,
            wobbleOffset: Math.random() * Math.PI * 2,
            amplitude: 0.5 + Math.random() * 1
        };
    }

    const drawPixelCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
        const r = Math.floor(size / 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Draw a rough pixel box/circle
        ctx.beginPath();
        ctx.moveTo(x + 2, y);
        ctx.lineTo(x + size - 2, y); // Top
        ctx.moveTo(x + size, y + 2);
        ctx.lineTo(x + size, y + size - 2); // Right
        ctx.moveTo(x + size - 2, y + size);
        ctx.lineTo(x + 2, y + size); // Bottom
        ctx.moveTo(x, y + size - 2);
        ctx.lineTo(x, y + 2); // Left
        
        // Corners
        ctx.rect(x + 2, y + 2, size - 4, size - 4); // Inner fill hint
        ctx.stroke();
        
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillRect(x + size/2 + 1, y + size/4, 2, 2);
    }

    const render = () => {
      // Background Gradient
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#020205'); 
      gradient.addColorStop(0.4, '#050a14');
      gradient.addColorStop(1, '#0f172a'); 
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const offset = (Date.now() / 50) % gridSize;
      
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = offset; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.globalAlpha = 0.1; 
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Update & Draw Particles (Background depth)
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.s, p.s);
      });
      ctx.globalAlpha = 1.0;

      // Update & Draw Bubbles (Foreground effect)
      const time = Date.now() / 1000;
      bubbles.forEach(b => {
          b.y -= b.speed;
          // Sine wave wobble
          const wobble = Math.sin(time + b.wobbleOffset) * b.amplitude;
          
          if (b.y < -20) {
              // Reset to bottom
              Object.assign(b, createBubble(canvas.width, canvas.height));
          }

          // Draw
          drawPixelCircle(ctx, b.x + wobble, b.y, b.size, 'rgba(96, 165, 250, 0.2)'); // Light blue transparent
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', init);
    init();
    render();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default PixelBackground;