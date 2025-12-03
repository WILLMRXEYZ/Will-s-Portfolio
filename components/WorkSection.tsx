
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, GridSize } from '../types';
import { X, Tv, Palette, User, ChevronRight, Play, PenTool, Video, Image as ImageIcon, Maximize, Loader2, RefreshCw, Trash2, Settings, Wrench, BoxSelect, Copy, Code, Terminal, Check } from 'lucide-react';
import PixelTV from './PixelTV';
import { STATIC_PROJECTS } from '../data/projects';
import { convertDriveLink } from '../utils/driveHelper';

// ==================================================================================
// [ HELPERS ]
// ==================================================================================

const StaticNoise = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let frame = 0;
        const animate = () => {
            const w = canvas.width;
            const h = canvas.height;
            const idata = ctx.createImageData(w, h);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;
            for (let i = 0; i < len; i++) {
                buffer32[i] = Math.random() < 0.5 ? 0xff000000 : 0xffffffff;
            }
            ctx.putImageData(idata, 0, 0);
            frame = requestAnimationFrame(animate);
        }
        animate();
        return () => cancelAnimationFrame(frame);
    }, []);
    return <canvas ref={canvasRef} width={320} height={200} className="w-full h-full absolute inset-0 z-20 opacity-80" />;
}

// --- ASSASSIN FOOTER ---
const AssassinFooter = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = containerRef.current.clientWidth;
        const height = 200; 
        canvas.width = width;
        canvas.height = height;

        type Bubble = { id: number; x: number; y: number; size: number; speed: number; wobbleOffset: number; amplitude: number };
        let bubbles: Bubble[] = [];

        const initBubbles = () => {
            bubbles = [];
            const count = Math.floor(width / 60);
            for(let i=0; i<count; i++) {
                bubbles.push({
                    id: Math.random(),
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: 8 + Math.random() * 12, 
                    speed: 0.5 + Math.random() * 0.8,
                    wobbleOffset: Math.random() * Math.PI * 2,
                    amplitude: 0.5 + Math.random() * 1
                });
            }
        };
        initBubbles();

        // Pixel Assassin Character
        const assassin = {
            x: width / 2,
            y: height - 50,
            vy: 0,
            onBubble: null as Bubble | null
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Bubbles
            bubbles.forEach(b => {
                b.y -= b.speed;
                if(b.y < -20) b.y = height + 20;
                
                // Draw pixel box bubble
                const s = b.size;
                ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)';
                ctx.strokeRect(b.x, b.y, s, s);
                // Shine
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.fillRect(b.x+2, b.y+2, s/4, s/4);
            });

            // Assassin
            if (assassin.onBubble) {
                assassin.x = assassin.onBubble.x + assassin.onBubble.size/2;
                assassin.y = assassin.onBubble.y - 12;
                if (assassin.y < 0) assassin.onBubble = null; // Jump off if too high
            } else {
                assassin.y += assassin.vy;
                assassin.vy += 0.2; // Gravity
                
                // Collision
                bubbles.forEach(b => {
                    if (Math.abs(assassin.x - b.x) < b.size && Math.abs(assassin.y - b.y) < 10 && assassin.vy > 0) {
                        assassin.onBubble = b;
                        assassin.vy = 0;
                    }
                });

                if (assassin.y > height + 20) {
                    assassin.y = height;
                    assassin.vy = -8; // Jump
                    assassin.x = Math.random() * width;
                }
            }

            // Draw Assassin (Black Pixel Character)
            ctx.fillStyle = 'black';
            ctx.fillRect(assassin.x - 4, assassin.y, 8, 12); // Body
            ctx.fillStyle = 'red';
            ctx.fillRect(assassin.x - 2, assassin.y + 2, 4, 2); // Scarf
            
            requestAnimationFrame(animate);
        };
        const frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);
    return <div ref={containerRef} className="w-full h-[200px] mt-4 relative"><canvas ref={canvasRef} className="block w-full h-full" /></div>;
};

// --- CODE GENERATOR MODAL ---
interface GeneratorProps {
    category: string;
    onClose: () => void;
}

const CodeGeneratorModal: React.FC<GeneratorProps> = ({ category, onClose }) => {
    const [driveLink, setDriveLink] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [config, setConfig] = useState({
        size: '1x1' as GridSize,
        brightness: 100,
        contrast: 100,
        saturate: 100,
        objectPosition: '50% 50%',
        fit: 'cover' as 'cover' | 'contain'
    });
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        const url = convertDriveLink(driveLink);
        if (url) {
            setPreviewUrl(url);
        } else {
            alert("Invalid Google Drive Link");
        }
    };

    const getCode = () => {
        if (!previewUrl) return "// Enter a valid link first";
        
        return `{
    id: ${Date.now()},
    title: "Project ${Date.now()}",
    type: '${category}',
    imageUrl: "${previewUrl}",
    size: '${config.size}',
    brightness: ${config.brightness},
    contrast: ${config.contrast},
    saturate: ${config.saturate},
    objectPosition: '${config.objectPosition}',
    fit: '${config.fit}',
    driveLink: "${driveLink}"
},`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const imgStyle = {
        filter: `brightness(${config.brightness}%) contrast(${config.contrast}%) saturate(${config.saturate}%)`,
        objectPosition: config.objectPosition,
        objectFit: config.fit
    };

    return (
        <div className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-[90vh] bg-gray-900 border-2 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col md:flex-row overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 z-20 text-gray-500 hover:text-white"><X /></button>
                
                {/* LEFT: CONTROLS */}
                <div className="w-full md:w-1/3 bg-black p-6 border-r border-gray-800 overflow-y-auto custom-scrollbar">
                    <h2 className="text-xl font-bold text-green-500 mb-6 flex items-center gap-2"><Terminal size={20}/> CODE GENERATOR</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 mb-2 block">1. PASTE GOOGLE DRIVE LINK</label>
                            <div className="flex gap-2">
                                <input 
                                    value={driveLink}
                                    onChange={(e) => setDriveLink(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full bg-gray-800 border border-gray-600 p-2 text-xs text-white"
                                />
                                <button onClick={handleGenerate} className="bg-green-600 text-white px-3 text-xs font-bold">LOAD</button>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Make sure link is "Anyone with link"</p>
                        </div>

                        {previewUrl && (
                            <>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-2 block">2. SIZE & FIT</label>
                                    <div className="grid grid-cols-4 gap-2 mb-2">
                                        {['1x1','1x2','2x1','2x2','3x2','2x3'].map(s => (
                                            <button key={s} onClick={() => setConfig({...config, size: s as GridSize})} className={`text-[10px] p-1 border ${config.size === s ? 'bg-green-600 text-white' : 'border-gray-700 text-gray-500'}`}>{s}</button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setConfig({...config, fit: 'cover'})} className={`flex-1 text-[10px] p-1 border ${config.fit === 'cover' ? 'bg-blue-600 text-white' : 'border-gray-700'}`}>COVER</button>
                                        <button onClick={() => setConfig({...config, fit: 'contain'})} className={`flex-1 text-[10px] p-1 border ${config.fit === 'contain' ? 'bg-blue-600 text-white' : 'border-gray-700'}`}>CONTAIN</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-2 block">3. FILTERS</label>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] text-gray-500"><span>Bright</span><span>{config.brightness}%</span></div>
                                        <input type="range" min="0" max="200" value={config.brightness} onChange={e=>setConfig({...config, brightness: Number(e.target.value)})} className="w-full accent-green-500"/>
                                        <div className="flex justify-between text-[10px] text-gray-500"><span>Contrast</span><span>{config.contrast}%</span></div>
                                        <input type="range" min="0" max="200" value={config.contrast} onChange={e=>setConfig({...config, contrast: Number(e.target.value)})} className="w-full accent-green-500"/>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-2 block">4. ALIGNMENT</label>
                                    <div className="grid grid-cols-3 w-24 h-24 gap-1 mx-auto bg-gray-800 p-1">
                                        {['0% 0%', '50% 0%', '100% 0%', '0% 50%', '50% 50%', '100% 50%', '0% 100%', '50% 100%', '100% 100%'].map((pos, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setConfig({...config, objectPosition: pos})}
                                                className={`w-full h-full border ${config.objectPosition === pos ? 'bg-white' : 'border-gray-600 hover:bg-gray-700'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT: PREVIEW & CODE */}
                <div className="flex-1 bg-gray-900 flex flex-col relative">
                    <div className="flex-1 p-8 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                        {previewUrl ? (
                            <div className={`relative shadow-2xl border-2 border-white transition-all duration-300`} 
                                style={{ 
                                    width: config.size.startsWith('2') ? '400px' : '200px',
                                    height: config.size.endsWith('2') ? '400px' : '200px',
                                }}>
                                <img src={previewUrl} className="w-full h-full bg-gray-800" style={imgStyle} />
                            </div>
                        ) : (
                            <div className="text-gray-600 font-pixel text-xs">PREVIEW AREA</div>
                        )}
                    </div>
                    
                    <div className="h-48 bg-black border-t border-gray-700 p-4 font-mono text-xs relative">
                        <div className="absolute top-0 left-0 bg-green-600 text-white px-2 py-1 text-[10px] font-bold">5. COPY THIS CODE</div>
                        <textarea 
                            readOnly 
                            value={getCode()} 
                            className="w-full h-full bg-transparent text-green-400 p-4 resize-none outline-none font-mono"
                        />
                        <button 
                            onClick={copyToClipboard}
                            className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 font-bold flex items-center gap-2 hover:bg-green-400"
                        >
                            {copied ? <Check size={16}/> : <Copy size={16}/>}
                            {copied ? "COPIED!" : "COPY CODE"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
interface WorkSectionProps { 
    coins: number; 
    isAdmin: boolean;
}

const WorkSection: React.FC<WorkSectionProps> = ({ coins, isAdmin }) => {
  const [category, setCategory] = useState<'illustration' | 'character' | 'animation' | 'tattoo' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Project | null>(null);
  const [activeChannel, setActiveChannel] = useState(0);
  const [isTvStatic, setIsTvStatic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Admin Tools
  const [isEditing, setIsEditing] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  // Projects strictly from file
  const currentList = STATIC_PROJECTS.filter(p => p.type === category);

  const handleCategorySelect = (cat: 'illustration' | 'character' | 'animation' | 'tattoo') => {
      if (cat === category) return;
      setIsTransitioning(true);
      setTimeout(() => {
          setCategory(cat);
          setIsTransitioning(false);
          setIsPlaying(false);
      }, 400); 
  };

  const changeChannel = (index: number) => {
      if (index === activeChannel) return;
      setIsPlaying(false);
      setIsTvStatic(true);
      setTimeout(() => {
          setActiveChannel(index);
          setTimeout(() => {
              setIsTvStatic(false);
          }, 300);
      }, 300);
  };

  const togglePlay = () => {
      const video = document.getElementById('tv-video-player') as HTMLVideoElement;
      if (video) {
          if (video.paused) {
              video.play();
              setIsPlaying(true);
          } else {
              video.pause();
              setIsPlaying(false);
          }
      } else {
        setIsPlaying(!isPlaying);
      }
  };

  const isTattooMode = category === 'tattoo';

  const getGridClasses = (size?: GridSize) => {
      switch(size) {
          case '2x2': return 'col-span-2 row-span-2';
          case '2x1': return 'col-span-2 row-span-1';
          case '1x2': return 'col-span-1 row-span-2';
          case '3x2': return 'col-span-2 md:col-span-3 row-span-2';
          case '4x2': return 'col-span-2 md:col-span-4 row-span-2';
          case '2x3': return 'col-span-2 row-span-3';
          default: return 'col-span-1 row-span-1';
      }
  };

  const getImageStyle = (p: Project) => ({
      filter: `${p.filter || ''} brightness(${p.brightness || 100}%) contrast(${p.contrast || 100}%) saturate(${p.saturate || 100}%)`,
      objectPosition: p.objectPosition || '50% 50%',
      objectFit: (p.fit || 'cover') as any
  });

  const getThemeClasses = () => {
    switch (category) {
        case 'illustration': return { containerBorder: 'border-accent-blue shadow-[0_0_20px_rgba(96,165,250,0.2)]', containerBg: 'bg-blue-900/10', footerBorder: 'border-accent-blue' };
        case 'character': return { containerBorder: 'border-accent-purple shadow-[0_0_20px_rgba(168,85,247,0.2)]', containerBg: 'bg-purple-900/10', footerBorder: 'border-accent-purple' };
        case 'tattoo': return { containerBorder: 'border-rose-800 shadow-[0_0_20px_rgba(225,29,72,0.2)]', containerBg: 'bg-rose-950/20', footerBorder: 'border-rose-800' };
        case 'animation': return { containerBorder: 'border-black shadow-[0_0_30px_rgba(0,0,0,0.8)]', containerBg: 'bg-black', footerBorder: 'border-gray-900' };
        default: return { containerBorder: 'border-gray-800', containerBg: 'bg-black/30', footerBorder: 'border-gray-800' };
    }
  };
  const theme = getThemeClasses();

  return (
    <div className="min-h-screen relative flex flex-col p-4 md:p-8 items-center justify-center font-tech overflow-hidden">
        
        <AnimatePresence>
            {isTransitioning && (
                <motion.div 
                    initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                    exit={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 bg-accent-orange flex items-center justify-center"
                >
                    <span className="font-pixel text-black text-4xl animate-pulse">LOADING DATA...</span>
                </motion.div>
            )}
        </AnimatePresence>
        
        {!category && !isTransitioning && (
            <div className="w-full max-w-6xl z-10 flex flex-col gap-6 items-center justify-center p-4">
                <div className="w-full flex justify-between px-4 mb-4 pointer-events-none opacity-50 font-pixel text-xs text-accent-blue">
                    <span>SELECT_MODE</span>
                    <span>P1: WILL</span>
                    <span className="text-yellow-400">COINS: {coins}</span>
                    {isAdmin && <span className="text-green-500 animate-pulse">ADMIN_ACCESS_GRANTED</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <MenuCard title="2D/3D ILLUSTRATION" subtitle="VISUAL_DATA" index="01" icon={<Palette size={40} />} accentColor="border-accent-blue" bgColor="bg-blue-900/20" textColor="text-accent-blue" delay={0.1} onClick={() => handleCategorySelect('illustration')} />
                    <MenuCard title="CHARACTER" subtitle="AVATAR_GEN" index="02" icon={<User size={40} />} accentColor="border-accent-purple" bgColor="bg-purple-900/20" textColor="text-accent-purple" delay={0.2} onClick={() => handleCategorySelect('character')} />
                    <MenuCard title="TATTOO" subtitle="INK_ARCHIVE" index="03" icon={<PenTool size={40} />} accentColor="border-rose-600" bgColor="bg-rose-900/20" textColor="text-rose-500" delay={0.3} onClick={() => handleCategorySelect('tattoo')} />
                    <MenuCard title="ANIMATION" subtitle="MOTION_SEQ" index="04" icon={<Tv size={40} />} accentColor="border-accent-orange" bgColor="bg-orange-900/20" textColor="text-accent-orange" delay={0.4} onClick={() => handleCategorySelect('animation')} />
                </div>
                {/* Simplified footer for display */}
                <div className="w-full h-12 bg-black/20 mt-4 rounded border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-pixel">
                    SYSTEM STATUS: OPTIMAL
                </div>
                
                {/* ASSASSIN FOOTER */}
                <AssassinFooter />
            </div>
        )}

        {category && (
            <div className="w-full h-[90vh] relative flex flex-col max-w-7xl mx-auto z-10">
                <div className={`flex flex-wrap md:flex-nowrap gap-4 items-center mb-6 p-4 rounded-sm border-2 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500 ${isTattooMode ? 'bg-rose-950/80 border-rose-800 shadow-[0_0_20px_rgba(225,29,72,0.2)]' : (category === 'animation' ? 'bg-black border-gray-900 shadow-[0_4px_10px_black]' : 'bg-black/80 border-gray-700 shadow-[4px_4px_0_0_rgba(255,255,255,0.1)]')}`}>
                    <NavTab label="2D/3D ILLUSTRATION" isActive={category === 'illustration'} color="text-accent-blue" onClick={() => handleCategorySelect('illustration')} />
                    <div className="hidden md:block w-px h-6 bg-gray-600 mx-2"></div>
                    <NavTab label="CHARACTER" isActive={category === 'character'} color="text-accent-purple" onClick={() => handleCategorySelect('character')} />
                    <div className="hidden md:block w-px h-6 bg-gray-600 mx-2"></div>
                    <NavTab label="TATTOO" isActive={category === 'tattoo'} color="text-rose-500" onClick={() => handleCategorySelect('tattoo')} />
                    <div className="hidden md:block w-px h-6 bg-gray-600 mx-2"></div>
                    <NavTab label="ANIMATION" isActive={category === 'animation'} color="text-accent-orange" onClick={() => handleCategorySelect('animation')} />
                    <div className="flex-1"></div>
                    
                    {/* ADMIN TOOLS */}
                    {isAdmin && (
                        <div className="flex items-center gap-2">
                             <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsEditing(!isEditing)}
                                className={`p-2 border rounded ${isEditing ? 'bg-yellow-500 text-black border-yellow-600' : 'border-gray-600 text-gray-400 hover:text-yellow-400'}`}
                             >
                                 <Wrench size={16} />
                             </motion.button>
                             {isEditing && (
                                 <button 
                                    onClick={() => setShowGenerator(true)}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-900/50 border border-green-500 text-green-500 text-xs font-pixel rounded hover:bg-green-500 hover:text-black transition-colors"
                                 >
                                     <Code size={14}/> GENERATOR
                                 </button>
                             )}
                        </div>
                    )}

                    <motion.button whileTap={{scale: 0.95}} onClick={() => setCategory(null)} className={`flex items-center gap-2 font-pixel text-xs px-4 py-2 border rounded transition-colors ${isTattooMode ? 'text-rose-200 border-rose-800 hover:bg-rose-900' : 'text-red-400 hover:text-red-300 border-red-900 hover:bg-red-900/30'}`}>
                        <X size={14} /> [ EXIT ]
                    </motion.button>
                </div>

                <div className={`flex-1 relative overflow-hidden rounded-sm border-2 shadow-inner transition-all duration-500 flex flex-col ${theme.containerBg} ${theme.containerBorder}`}>
                    
                    {/* --- PIXEL TV ANIMATION VIEW --- */}
                    {category === 'animation' ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-4">
                            {currentList.length > 0 ? (
                                <>
                                <PixelTV>
                                    <div className="relative w-full h-full bg-black group">
                                        {isTvStatic ? (
                                            <StaticNoise />
                                        ) : (
                                            <>
                                                {currentList[activeChannel]?.mediaType === 'video' ? (
                                                    <video 
                                                        id="tv-video-player"
                                                        src={currentList[activeChannel].imageUrl} 
                                                        className="w-full h-full object-cover" 
                                                        loop 
                                                        muted={false}
                                                        playsInline
                                                        onClick={togglePlay}
                                                    />
                                                ) : (
                                                    <img src={currentList[activeChannel]?.imageUrl} className="w-full h-full object-cover opacity-80" />
                                                )}
                                                
                                                {!isPlaying && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                                                        <Play className="text-white w-16 h-16 opacity-80" />
                                                    </div>
                                                )}

                                                <div className="absolute top-4 left-4 font-pixel text-green-500 text-xs z-20 flex flex-col gap-1">
                                                    <span>AV-1</span>
                                                    <span>CH 0{activeChannel + 1}</span>
                                                </div>

                                                <button 
                                                    onClick={() => setSelectedImage(currentList[activeChannel])}
                                                    className="absolute bottom-3 right-3 p-2 bg-white/10 hover:bg-white/30 text-white rounded backdrop-blur-sm transition-colors z-20"
                                                >
                                                    <Maximize size={16} />
                                                </button>
                                            </>
                                        )}
                                        {/* Scanlines overlay */}
                                        <div className="absolute inset-0 scanlines pointer-events-none opacity-20"></div>
                                    </div>
                                </PixelTV>
                                
                                {/* CHANNEL CONTROLS */}
                                <div className="mt-8 flex gap-4 overflow-x-auto p-4 max-w-full">
                                    {currentList.map((p, i) => (
                                        <motion.div 
                                            key={p.id}
                                            onClick={() => changeChannel(i)}
                                            whileHover={{ scale: 1.1 }}
                                            className={`w-24 h-16 md:w-32 md:h-20 shrink-0 border-2 cursor-pointer relative ${activeChannel === i ? 'border-accent-orange' : 'border-gray-800 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                        >
                                            <img src={p.imageUrl} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-1 right-1 bg-black text-white text-[8px] px-1 font-pixel">CH {i + 1}</div>
                                            {p.mediaType === 'video' && <div className="absolute top-1 left-1 bg-accent-orange text-black p-0.5 rounded-sm"><Video size={8} /></div>}
                                        </motion.div>
                                    ))}
                                </div>
                                </>
                            ) : (
                                <div className="text-gray-500 font-pixel text-xs">NO SIGNAL (ADD VIDEOS VIA GENERATOR)</div>
                            )}
                        </div>
                    ) : (
                        /* --- GALLERY GRID --- */
                        <div className={`flex-1 overflow-y-auto custom-scrollbar relative`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-0 grid-flow-dense w-full">
                                {currentList.map((p, i) => (
                                    <ImageItem 
                                        key={p.id} 
                                        p={p} 
                                        isTattooMode={isTattooMode} 
                                        onSelect={() => setSelectedImage(p as Project)}
                                        getImageStyle={getImageStyle}
                                        getGridClasses={getGridClasses}
                                        isEditing={isEditing}
                                    />
                                ))}
                                {currentList.length === 0 && (
                                    <div className="col-span-full flex items-center justify-center h-64 text-gray-500 font-pixel text-xs">
                                        NO STATIC DATA FOUND. USE GENERATOR.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* FOOTER */}
                    <div className={`w-full py-2 flex items-center justify-center border-t gap-6 backdrop-blur-md sticky bottom-0 z-40 transition-colors ${category === 'animation' ? 'bg-black border-gray-900' : 'bg-black/80'} ${theme.footerBorder}`}>
                        <span className="text-[8px] font-pixel text-gray-600 tracking-widest opacity-50">
                            {isAdmin ? "SYSTEM: ADMIN MODE // STATIC FILES" : "READ_ONLY_MODE"}
                        </span>
                    </div>
                </div>
            </div>
        )}

        {/* MODALS */}
        <AnimatePresence>
            {showGenerator && category && (
                <CodeGeneratorModal category={category} onClose={() => setShowGenerator(false)} />
            )}
        </AnimatePresence>

        <AnimatePresence>
            {selectedImage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <motion.div className={`relative max-w-6xl w-full max-h-[90vh] border-4 shadow-[0_0_100px_rgba(255,255,255,0.1)] bg-black flex items-center justify-center ${selectedImage.type === 'tattoo' ? 'border-rose-600 shadow-[0_0_50px_rgba(225,29,72,0.3)]' : 'border-white'}`} onClick={(e) => e.stopPropagation()}>
                        {selectedImage.mediaType === 'video' ? (
                             <video src={selectedImage.imageUrl} controls autoPlay className="max-w-full max-h-[85vh]" />
                        ) : (
                             <img src={selectedImage.imageUrl} alt={selectedImage.title} style={getImageStyle(selectedImage)} className="max-w-full max-h-[85vh] object-contain block mx-auto" />
                        )}
                        <motion.button onClick={() => setSelectedImage(null)} className="absolute -top-6 -right-6 bg-red-500 text-white w-12 h-12 flex items-center justify-center border-4 border-white"><X size={24} /></motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

// --- Sub-Components ---
const ImageItem = ({ p, isTattooMode, onSelect, getImageStyle, getGridClasses, isEditing }: any) => {
    return (
        <motion.div 
            className={`relative group overflow-hidden ${getGridClasses(p.size)} bg-gray-900 border-[0.5px] border-black/50`}
        >
            <img 
                src={p.imageUrl} 
                alt={p.title} 
                style={getImageStyle(p)}
                onClick={!isEditing ? onSelect : undefined}
                className={`w-full h-full cursor-pointer transition-all duration-500 hover:scale-105 ${isTattooMode && !p.filter ? 'opacity-80 hover:opacity-100 grayscale hover:grayscale-0' : ''}`}
                loading="lazy"
            />
            {isEditing && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] px-1 rounded z-30 font-bold font-mono">
                    ID: {p.id}
                </div>
            )}
        </motion.div>
    );
};

const MenuCard = ({ title, subtitle, index, icon, accentColor, bgColor, textColor, delay, onClick }: any) => (
    <motion.div onClick={onClick} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, type: 'spring' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full flex flex-row items-center relative cursor-pointer group border-4 ${accentColor} ${bgColor} shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 overflow-hidden p-6`}>
        <div className={`mr-6 p-3 md:p-4 border-4 border-white bg-black/40 rounded-sm z-10 ${textColor}`}>{icon}</div>
        <div className="flex-1 text-left z-10">
            <h3 className={`font-pixel text-lg md:text-2xl text-white mb-1 leading-relaxed`}>{title}</h3>
            <p className="font-tech text-gray-400 text-xs tracking-[0.2em] uppercase">{subtitle}</p>
        </div>
    </motion.div>
);

const NavTab = ({ label, isActive, color, onClick }: { label: string, isActive: boolean, color: string, onClick: () => void }) => (
    <motion.button onClick={onClick} className={`relative px-4 py-2 font-pixel text-xs md:text-sm transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
        <span className="relative z-10">{label}</span>
        {isActive && <span className={`ml-2 ${color}`}>●</span>}
    </motion.button>
);

export default WorkSection;
