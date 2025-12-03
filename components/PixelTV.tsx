import React from 'react';

interface PixelTVProps {
  children: React.ReactNode;
}

const PixelTV: React.FC<PixelTVProps> = ({ children }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto pt-8 pb-12 px-8">
      {/* TV Antenna */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-1 h-24 bg-gray-400 rotate-[-30deg] origin-bottom"></div>
          <div className="absolute bottom-0 right-0 w-1 h-24 bg-gray-400 rotate-[30deg] origin-bottom"></div>
      </div>

      {/* Main Box - Using Shadow/Border for Pixel Look */}
      <div className="relative bg-[#8B4513] p-4 rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] border-4 border-[#5D2906]">
        
        {/* Top Highlight Pixel */}
        <div className="absolute top-1 left-1 right-1 h-1 bg-[#A0522D] opacity-50"></div>

        {/* Screen Bezel */}
        <div className="bg-[#2a2a2a] p-6 rounded-sm border-b-4 border-r-4 border-[#111] shadow-inner relative">
            
            {/* The Screen Content */}
            <div className="relative aspect-video bg-black overflow-hidden border-4 border-[#1a1a1a] rounded-sm">
                {children}
                
                {/* Screen Reflection / Glare */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            </div>

            {/* Brand Logo */}
            <div className="mt-2 text-center">
                <span className="font-pixel text-[8px] text-gray-500 tracking-[0.3em] uppercase">PIXEL-VISION</span>
            </div>
        </div>

        {/* Side Panel Controls */}
        <div className="absolute top-12 right-[-24px] w-8 h-48 bg-[#6b3e1e] border-r-4 border-b-4 border-[#3e220e] flex flex-col items-center gap-4 py-4 shadow-lg rounded-r-sm">
             {/* Knobs */}
             <div className="w-5 h-5 rounded-full bg-gray-800 border-2 border-gray-600 shadow-md transform hover:rotate-45 transition-transform cursor-pointer"></div>
             <div className="w-5 h-5 rounded-full bg-gray-800 border-2 border-gray-600 shadow-md transform hover:-rotate-45 transition-transform cursor-pointer"></div>
             
             {/* Vents */}
             <div className="flex flex-col gap-1 mt-auto w-full px-1">
                 <div className="h-1 bg-black/30 w-full"></div>
                 <div className="h-1 bg-black/30 w-full"></div>
                 <div className="h-1 bg-black/30 w-full"></div>
             </div>
        </div>

        {/* Feet */}
        <div className="absolute -bottom-4 left-8 w-8 h-4 bg-gray-900"></div>
        <div className="absolute -bottom-4 right-8 w-8 h-4 bg-gray-900"></div>
      </div>
    </div>
  );
};

export default PixelTV;