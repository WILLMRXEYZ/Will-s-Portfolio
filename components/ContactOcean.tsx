import React, { useEffect, useRef } from 'react';

const ContactOcean: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frameId = 0;

    // Entities
    const bubbles: { x: number; y: number; s: number; v: number }[] = [];
    const fish: { x: number; y: number; color: string; speed: number; size: number; offset: number }[] = [];
    const seaweeds: { x: number; height: number; segments: number; color: string }[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight * 0.8; // Compact height
      canvas.width = width;
      canvas.height = height;

      // Init Bubbles
      bubbles.length = 0;
      for (let i = 0; i < 50; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          s: Math.random() * 2 + 1,
          v: Math.random() * 0.5 + 0.2
        });
      }

      // Init Fish
      fish.length = 0;
      const colors = ['#F97316', '#FCD34D', '#EF4444', '#60A5FA'];
      for (let i = 0; i < 15; i++) {
        fish.push({
          x: Math.random() * width,
          y: Math.random() * (height - 100) + 50,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 1 + 0.5,
          size: Math.random() * 4 + 2,
          offset: Math.random() * Math.PI * 2
        });
      }

      // Init Seaweed (Geological/Plant structure)
      seaweeds.length = 0;
      const weedCount = Math.floor(width / 40);
      for (let i = 0; i < weedCount; i++) {
        seaweeds.push({
          x: i * 40 + Math.random() * 20,
          height: 100 + Math.random() * 100,
          segments: 10,
          color: Math.random() > 0.5 ? '#047857' : '#059669' // Green variations
        });
      }
    };

    const drawPixelRect = (x: number, y: number, w: number, h: number, color: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
    };

    const animate = () => {
      // Clear Canvas (Transparent) - Relies on Global Background
      ctx.clearRect(0, 0, width, height);

      const time = Date.now() / 1000;

      // Draw Bubbles
      bubbles.forEach(b => {
        b.y -= b.v;
        b.x += Math.sin(time + b.y * 0.05) * 0.5; // Wiggle
        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }
        drawPixelRect(b.x, b.y, b.s, b.s, 'rgba(255, 255, 255, 0.3)');
      });

      // Draw Geological Terrain (Bottom) - Darker to blend with new bg
      ctx.fillStyle = '#020617'; // Match the darkest part of global bg
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x+=20) {
          // Pixelated noisy ground
          const noise = Math.sin(x * 0.02) * 20 + Math.cos(x * 0.1) * 10;
          ctx.lineTo(x, height - 40 + noise);
      }
      ctx.lineTo(width, height);
      ctx.fill();

      // Draw Seaweed
      seaweeds.forEach(w => {
        let currentX = w.x;
        let currentY = height - 40; // Base on ground
        
        for (let i = 0; i < w.segments; i++) {
            const sway = Math.sin(time * 2 + w.x * 0.1 + i * 0.5) * (i * 2);
            drawPixelRect(currentX + sway, currentY - (i * (w.height/w.segments)), 4, (w.height/w.segments) + 1, w.color);
        }
      });

      // Draw Fish
      fish.forEach(f => {
        f.x -= f.speed; // Swim left
        const swimY = Math.sin(time * 5 + f.offset) * 5;
        
        if (f.x < -20) f.x = width + 20;

        // Draw Pixel Fish
        const fx = f.x;
        const fy = f.y + swimY;
        
        // Body
        drawPixelRect(fx, fy, f.size * 3, f.size * 2, f.color);
        // Tail (animated)
        const tailFlap = Math.sin(time * 15) > 0 ? 1 : -1;
        drawPixelRect(fx + f.size * 3, fy + (f.size/2) + tailFlap, f.size, f.size, f.color);
        // Eye
        drawPixelRect(fx + 2, fy + 2, 2, 2, 'white');
      });

      // Light Rays (Subtle Overlay)
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const rayGradient = ctx.createLinearGradient(0, 0, 0, height);
      rayGradient.addColorStop(0, 'rgba(255,255,255,0.05)');
      rayGradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rayGradient;
      
      // Moving rays
      for(let i=0; i<3; i++) {
          const rayX = (width/3 * i) + Math.sin(time * 0.5 + i) * 50;
          ctx.fillRect(rayX, 0, 60, height);
      }
      ctx.restore();

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default ContactOcean;