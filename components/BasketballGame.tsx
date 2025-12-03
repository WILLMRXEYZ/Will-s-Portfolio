import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState } from '../types';
import { Trophy, RotateCcw, X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onWin: () => void;
  onLoss: () => void;
}

const BasketballGame: React.FC<Props> = ({ onClose, onWin, onLoss }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    attempts: 5,
    isPlaying: false,
    gameOver: false,
    won: false,
  });
  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const requestRef = useRef<number | null>(null);

  // Game Physics State
  const ballPos = useRef({ x: 100, y: 300 });
  const ballVel = useRef({ x: 0, y: 0 });
  const isBallFlying = useRef(false);
  
  const drawPixelCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) => {
    ctx.fillStyle = color;
    // Simple approximation of a pixel circle
    ctx.beginPath();
    ctx.arc(Math.floor(x), Math.floor(y), radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawBasket = (ctx: CanvasRenderingContext2D) => {
    // Backboard
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(500, 100, 10, 80);
    ctx.fillStyle = '#EF4444'; // Red square
    ctx.fillRect(502, 130, 6, 20);
    
    // Rim
    ctx.strokeStyle = '#F97316';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(500, 150);
    ctx.lineTo(460, 150);
    ctx.stroke();

    // Net
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(460, 150);
    ctx.lineTo(470, 180);
    ctx.lineTo(490, 180);
    ctx.lineTo(500, 150);
    ctx.stroke();
  };

  const resetBall = () => {
    ballPos.current = { x: 100, y: 300 };
    ballVel.current = { x: 0, y: 0 };
    isBallFlying.current = false;
  };

  const update = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 600, 400);

    // Draw Floor
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 350, 600, 50);

    // Draw Basket
    drawBasket(ctx);

    // Ball Physics
    if (isBallFlying.current) {
      ballPos.current.x += ballVel.current.x;
      ballPos.current.y += ballVel.current.y;
      ballVel.current.y += 0.4; // Gravity

      // Check Collision with Basket (Rim is approx x: 460-500, y: 150)
      if (
        ballPos.current.x > 460 && 
        ballPos.current.x < 500 && 
        Math.abs(ballPos.current.y - 150) < 15 && 
        ballVel.current.y > 0
      ) {
        // Goal!
        setGameState(prev => ({ ...prev, score: prev.score + 1 }));
        isBallFlying.current = false;
        // Simple particle effect helper would go here
      }

      // Check Miss (Off screen)
      if (ballPos.current.y > 400 || ballPos.current.x > 600) {
        isBallFlying.current = false;
        setGameState(prev => ({ ...prev, attempts: prev.attempts - 1 }));
      }
    } else {
        // Respawn logic if not flying
        if (gameState.attempts > 0 && !gameState.gameOver) {
             // Ball sits at start
             ballPos.current = { x: 100, y: 300 };
        }
    }

    // Draw Ball
    if (gameState.attempts > 0 || isBallFlying.current) {
        drawPixelCircle(ctx, ballPos.current.x, ballPos.current.y, 12, '#F97316');
        // Ball Detail
        ctx.strokeStyle = '#7C2D12';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(Math.floor(ballPos.current.x), Math.floor(ballPos.current.y), 12, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Power Bar
    if (gameState.attempts > 0 && !isBallFlying.current) {
        ctx.fillStyle = '#374151';
        ctx.fillRect(50, 200, 20, 100);
        ctx.fillStyle = `rgb(${power * 2.5}, ${255 - power * 2.5}, 0)`;
        ctx.fillRect(50, 300 - power, 20, power);
    }
    
    // Draw Score in Pixel Font on Canvas
    ctx.font = '20px "Press Start 2P"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`SCORE: ${gameState.score} / 5`, 20, 40);
    ctx.fillText(`BALLS: ${gameState.attempts}`, 20, 70);

    requestRef.current = requestAnimationFrame(update);
  }, [gameState.attempts, gameState.gameOver, gameState.score, power]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  useEffect(() => {
    if (gameState.gameOver) return;

    // Win Condition: Must reach 5 points
    if (gameState.score >= 5) {
       setGameState(prev => ({...prev, gameOver: true, won: true}));
       onWin();
    } 
    // Loss Condition: Ran out of attempts before reaching 5
    else if (gameState.attempts === 0) {
        setGameState(prev => ({...prev, gameOver: true, won: false}));
        onLoss();
    }
  }, [gameState.attempts, gameState.score, gameState.gameOver, onLoss, onWin]);

  const handleInteractionStart = () => {
    if (isBallFlying.current || gameState.gameOver) return;
    setIsCharging(true);
  };

  const handleInteractionEnd = () => {
    if (!isCharging || gameState.gameOver) return;
    setIsCharging(false);
    
    // Launch Ball
    // Calculate velocity based on power (0-100)
    // Needs to reach x=480, y=150 from x=100, y=300
    // Simple approximation logic
    const angle = -Math.PI / 3; // 60 degrees up
    const speed = 10 + (power / 100) * 15; // Range of speed
    
    ballVel.current = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
    };
    isBallFlying.current = true;
    setPower(0);
  };

  // Charge Loop
  useEffect(() => {
    let interval: number;
    if (isCharging) {
        interval = window.setInterval(() => {
            setPower(p => (p >= 100 ? 0 : p + 2));
        }, 16);
    }
    return () => clearInterval(interval);
  }, [isCharging]);

  return (
    <div className="relative w-full h-full bg-bg-mid rounded-lg overflow-hidden border-4 border-accent-blue/30 shadow-2xl">
      <canvas 
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full cursor-pointer"
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      />
      <div className="absolute top-4 right-4 z-20">
        <button onClick={onClose} className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            <X size={20} />
        </button>
      </div>

      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 text-center p-4">
            <h2 className={`font-pixel text-2xl mb-4 ${gameState.won ? 'text-green-400' : 'text-red-500'}`}>
                {gameState.won ? 'YOU WIN' : 'GAME OVER'}
            </h2>
            <p className="font-tech text-gray-300 mb-6">
                {gameState.won ? 'Mission Accomplished.' : 'Target not met (5 pts).'}
            </p>
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        setGameState({ score: 0, attempts: 5, isPlaying: true, gameOver: false, won: false });
                        resetBall();
                    }}
                    className="flex items-center gap-2 bg-accent-blue px-4 py-2 font-pixel text-xs rounded hover:brightness-110"
                >
                    <RotateCcw size={16} /> RESTART
                </button>
                <button onClick={onClose} className="font-pixel text-xs underline text-gray-400">EXIT</button>
            </div>
        </div>
      )}
      
      {!gameState.isPlaying && !gameState.gameOver && (
          <div className="absolute bottom-4 right-4 text-xs font-tech text-gray-400 pointer-events-none">
              Hold click to power up. Goal: 5 Pts
          </div>
      )}
    </div>
  );
};

export default BasketballGame;