
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Instagram, Linkedin, Mail, ArrowDown, ChevronUp, AlertTriangle, X } from 'lucide-react';
import EntryScreen from './components/EntryScreen';
import AboutModal from './components/AboutModal';
import WorkSection from './components/WorkSection';
import PeelButton from './components/PeelButton';
import PixelBackground from './components/PixelBackground';
import ContactOcean from './components/ContactOcean';
import GlobalClickFx from './components/GlobalClickFx';
import AdminLogin from './components/AdminLogin';
import AdminFishTrigger from './components/AdminFishTrigger';
import AdminGuideModal from './components/AdminGuideModal'; // UPDATED IMPORT
import { ViewState } from './types';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('entry');
  const [showAbout, setShowAbout] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [brickWallTriggered, setBrickWallTriggered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [titleShattered, setTitleShattered] = useState(false);
  const [coins, setCoins] = useState(0);
  
  // Admin State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminGuide, setShowAdminGuide] = useState(false); // UPDATED STATE NAME

  // Parallax Values for Title
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const titleRotateX = useTransform(mouseY, [-500, 500], [15, -15]);
  const titleRotateY = useTransform(mouseX, [-500, 500], [-15, 15]);

  // Contact States
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
      const handleScroll = () => {
          if (!containerRef.current) return;
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          const progress = scrollTop / (scrollHeight - clientHeight);
          setScrollProgress(progress);
          const isPage1 = scrollTop < clientHeight * 0.8; 
          setShowBackTop(scrollTop > 200 && isPage1);
      };

      const handleMouseMove = (e: MouseEvent) => {
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          mouseX.set(e.clientX - cx);
          mouseY.set(e.clientY - cy);
      };

      const ref = containerRef.current;
      ref?.addEventListener('scroll', handleScroll);
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
          ref?.removeEventListener('scroll', handleScroll);
          window.removeEventListener('mousemove', handleMouseMove);
      };
  }, [viewState, mouseX, mouseY]);

  const handleGameWin = () => {
      setCoins(prev => prev + 1);
  };

  const handleGameLoss = () => {
      setShowAbout(false);
      setBrickWallTriggered(true);
      setTimeout(() => {
          setBrickWallTriggered(false);
          setTitleShattered(false);
          setViewState('entry');
      }, 1500);
  };

  const resetToEntry = () => {
      setViewState('entry');
      setTitleShattered(false);
  };

  const handleTitleClick = () => {
      if (titleShattered) return;
      setTitleShattered(true);
      setTimeout(() => {
          setShowAbout(true);
          setTimeout(() => setTitleShattered(false), 2000); 
      }, 800);
  };

  if (viewState === 'entry') {
      return (
        <>
            <GlobalClickFx />
            <EntryScreen onEnter={() => setViewState('home')} />
        </>
      );
  }

  return (
    <div className={`relative w-full h-screen text-white font-tech overflow-hidden selection:bg-accent-orange selection:text-black ${brickWallTriggered ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}`}>
      <GlobalClickFx />
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-10px, -10px); }
          20% { transform: translate(10px, 10px); }
          30% { transform: translate(-10px, 10px); }
          40% { transform: translate(10px, -10px); }
          50% { transform: translate(-10px, 0); }
          60% { transform: translate(10px, 0); }
        }
      `}</style>

      <PixelBackground />
      
      <div ref={containerRef} className="h-full w-full overflow-y-auto scroll-smooth scrollbar-hide relative z-10">
        
        {/* === PAGE 1: HOME === */}
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {showBackTop && (
                    <motion.div 
                        className="fixed top-0 left-0 w-full h-24 z-50 flex justify-center items-start pt-4 hover:bg-gradient-to-b hover:from-accent-blue/20 to-transparent transition-all group cursor-pointer"
                        onClick={resetToEntry}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ opacity: 1 }}
                    >
                        <div className="bg-bg-dark border border-accent-blue px-6 py-2 rounded-b-lg flex items-center gap-2 group-hover:shadow-[0_0_20px_#60A5FA]">
                            <ChevronUp className="animate-bounce" />
                            <span className="font-pixel text-xs text-accent-blue">BACK TO SYSTEM</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-8 h-full items-center">
                <div className="md:col-span-4 flex justify-end items-center h-full order-2 md:order-1">
                    <PeelButton text="ABOUT ME" onClick={() => setShowAbout(true)} />
                </div>
                <div className="md:col-span-8 h-[60vh] flex flex-col justify-center border-l-2 border-gray-800 pl-12 relative order-1 md:order-2 perspective-[1000px]">
                    <div className="cursor-pointer group" onClick={handleTitleClick}>
                        {titleShattered ? (
                           <ShatteredTitle text="WILL'S PORTFOLIO" />
                        ) : (
                           <motion.div style={{ rotateX: titleRotateX, rotateY: titleRotateY, transformStyle: "preserve-3d" }}>
                               <motion.h1 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="font-pixel text-5xl md:text-7xl leading-tight bg-clip-text text-transparent bg-gradient-to-b from-accent-blue via-accent-purple to-accent-orange group-hover:brightness-125 transition-all drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]"
                               >
                                   WILL'S<br />PORTFOLIO
                               </motion.h1>
                           </motion.div>
                        )}
                    </div>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 1, duration: 1 }}
                        className="h-1 bg-gray-700 mt-4 mb-4 relative overflow-hidden" 
                    >
                         <div className="absolute inset-0 bg-accent-blue/50 w-full h-full animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                    <p className="text-accent-light font-pixel text-sm md:text-base tracking-widest flex items-center gap-2">
                        ILLUSTRATOR <span className="text-accent-purple animate-pulse">/</span> 3D ANIMATOR
                    </p>
                </div>
            </div>

            <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent-light flex flex-col items-center gap-2" animate={{ opacity: scrollProgress > 0.1 ? 0 : 1 }}>
                <span className="font-pixel text-[10px] animate-pulse">SCROLL</span>
                <ArrowDown />
            </motion.div>
        </section>

        {/* === PAGE 2: WORK === */}
        <section className="min-h-screen border-t border-gray-800/50 relative backdrop-blur-[2px]">
            <WorkSection coins={coins} isAdmin={isAdmin} />
        </section>

        {/* === PAGE 3: CONTACT === */}
        <section className="h-[60vh] relative flex flex-col items-center justify-center overflow-hidden">
             <div className="absolute inset-0 z-0"><ContactOcean /></div>
             
             {/* Admin Fish Trigger */}
             <AdminFishTrigger onClick={() => setShowAdminLogin(true)} />

             <div className="relative z-10 text-center">
                <h2 className="text-4xl font-pixel text-white mb-12 drop-shadow-[0_4px_0_rgba(0,0,0,0.8)]">CONTACT</h2>
                <div className="flex gap-12 md:gap-24">
                    <ContactIcon icon={<Instagram size={32} />} label="Instagram" color="hover:text-pink-400" glow="hover:shadow-[0_0_30px_#ec4899]" onClick={() => window.open('https://www.instagram.com/will_axis_05/', '_blank')} />
                    <ContactIcon icon={<Linkedin size={32} />} label="LinkedIn" color="hover:text-blue-400" glow="hover:shadow-[0_0_30px_#3b82f6]" onClick={() => window.open('https://www.linkedin.com/in/will-liu-024509311/', '_blank')} />
                    <ContactIcon icon={<Mail size={32} />} label="Email" color="hover:text-white" glow="hover:shadow-[0_0_30px_#ffffff]" onClick={() => setShowEmailModal(true)} />
                </div>
             </div>
             
             <footer className="absolute bottom-4 text-white/50 font-pixel text-[8px] z-10 select-none">
                 © 2024 WILL'S PORTFOLIO SYSTEM. ALL RIGHTS RESERVED. {isAdmin && <span className="text-green-400 ml-2">[ADMIN_ACTIVE]</span>}
             </footer>
        </section>
      </div>

      <AboutModal 
        isOpen={showAbout} 
        onClose={() => setShowAbout(false)} 
        onGameWin={handleGameWin}
        onGameLoss={handleGameLoss}
        isAdmin={isAdmin}
      />

      <AdminLogin 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)}
        onLogin={() => {
            setIsAdmin(true);
            setShowAdminGuide(true);
        }}
      />
      
      <AnimatePresence>
        {showAdminGuide && (
            <AdminGuideModal isOpen={showAdminGuide} onClose={() => setShowAdminGuide(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
          {showEmailModal && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowEmailModal(false)}>
                  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-bg-mid border-4 border-white p-8 relative shadow-[0_0_50px_rgba(255,255,255,0.2)] max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"><X size={24} /></button>
                      <div className="flex flex-col items-center gap-6">
                          <div className="p-4 rounded-full bg-white text-black"><Mail size={40} /></div>
                          <div className="text-center">
                              <h3 className="font-pixel text-xl mb-2">EMAIL ADDRESS</h3>
                              <div className="bg-black/50 p-4 border border-gray-700 rounded font-tech text-xl text-accent-blue select-all">willliu0511@gmail.com</div>
                              <p className="text-gray-500 text-xs mt-4 font-pixel">CLICK OUTSIDE TO CLOSE</p>
                          </div>
                      </div>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      <AnimatePresence>
          {brickWallTriggered && (
              <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/40 backdrop-blur-md pointer-events-none">
                 <div className="bg-black border-4 border-red-600 p-12 text-center shadow-[0_0_100px_red]">
                     <AlertTriangle size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
                     <h1 className="font-pixel text-4xl text-red-500 mb-2">WARNING</h1>
                     <p className="font-tech text-white text-xl">SYSTEM INTEGRITY COMPROMISED</p>
                     <p className="font-pixel text-xs text-red-400 mt-4">CRITICAL ERROR.</p>
                 </div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

const ShatteredTitle = ({ text }: { text: string }) => {
    const chars = text.replace('<br />', ' ').split('');
    return (
        <div className="relative font-pixel text-5xl md:text-7xl leading-tight">
            {chars.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{ 
                        x: (Math.random() - 0.5) * 500, 
                        y: (Math.random() - 0.5) * 500, 
                        opacity: 0, 
                        rotate: (Math.random() - 0.5) * 360,
                        scale: 0
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-block text-accent-blue"
                    style={{ 
                        textShadow: '0 0 10px rgba(96,165,250,0.8)',
                        color: i % 2 === 0 ? '#60A5FA' : '#F97316'
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </div>
    );
}

const ContactIcon = ({ icon, label, color, glow, onClick }: { icon: React.ReactNode, label: string, color: string, glow: string, onClick: () => void }) => (
    <motion.div onClick={onClick} className={`flex flex-col items-center gap-4 group cursor-pointer text-gray-300 transition-colors duration-300 ${color}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <div className={`p-4 rounded-full border-2 border-white/20 bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:border-white ${glow}`}>{icon}</div>
        <span className="font-pixel text-[10px] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">{label}</span>
    </motion.div>
);

export default App;
