
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, Globe, Linkedin, Upload, Terminal, Loader2, Lock, Code, Check, Zap } from 'lucide-react';
import PeelButton from './PeelButton';
import BasketballGame from './BasketballGame';
import { jsPDF } from "jspdf";
import { convertDriveLink } from '../utils/driveHelper';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerBrickWall?: () => void;
  onGameWin?: () => void;
  onGameLoss?: () => void;
  isAdmin?: boolean;
}

// Default Avatar - Replace this string with your generated Drive Link code
const staticAvatar = "/assets/avatar.jpg"; 

// --- RESUME MODAL ---
const ResumeView: React.FC<{ onClose: () => void, avatarUrl: string | null }> = ({ onClose, avatarUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-white text-gray-800 rounded-sm shadow-2xl overflow-y-auto max-h-[90vh] relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full transition-colors"><X size={20} /></button>
        {/* Simplified Resume Content for brevity - assume content is same as before but using avatarUrl */}
        <div className="w-full md:w-1/3 bg-slate-100 p-8 flex flex-col gap-8 border-r border-gray-200">
            <div className="w-48 h-48 mx-auto bg-gray-300 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
                <img src={avatarUrl || "/assets/avatar.jpg"} className="w-full h-full object-cover" />
            </div>
            <div className="text-center">
                 <h2 className="text-2xl font-serif font-bold text-gray-800">Will Liu</h2>
                 <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Illustrator</p>
            </div>
             <div className="text-sm space-y-3 mt-4">
                <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-400"/>
                    <span>Oakville, ON</span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400"/>
                    <span>(825) 986-5635</span>
                </div>
                <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400"/>
                    <a href="mailto:willliu0511@gmail.com" className="hover:text-blue-600">willliu0511@gmail.com</a>
                </div>
                <div className="flex items-center gap-3">
                    <Globe size={16} className="text-gray-400"/>
                    <a href="https://willmrxeyz.github.io/Will-s-Portfolio/" className="hover:text-blue-600 break-all">Portfolio Link</a>
                </div>
                <div className="flex items-center gap-3">
                    <Linkedin size={16} className="text-gray-400"/>
                    <a href="https://www.linkedin.com/in/w-b-liui-024509311/" className="hover:text-blue-600 break-all">LinkedIn Profile</a>
                </div>
            </div>
        </div>
        <div className="w-full md:w-2/3 p-8">
            <h1 className="text-4xl font-serif mb-4">Resume</h1>
            <section className="mb-6">
                 <h3 className="text-blue-800 font-bold uppercase border-b-2 border-blue-800 mb-2">Objective</h3>
                 <p className="text-sm leading-relaxed">Motivated and creative 2D and 3D Artist & Animator with strong foundations in both 2D and 3D design. Passionate about character creation, storytelling, and visual development.</p>
            </section>
             <section className="mb-6">
                 <h3 className="text-blue-800 font-bold uppercase border-b-2 border-blue-800 mb-2">Experience</h3>
                 <div className="mb-4">
                     <h4 className="font-bold">Tattoo Artist & Designer | Private Studio</h4>
                     <p className="text-xs text-gray-500 mb-1">2024–Present</p>
                     <ul className="list-disc list-inside text-sm pl-2">
                         <li>Designed and executed customized tattoo artworks.</li>
                         <li>Collaborated with clients and maintained strong communication.</li>
                     </ul>
                 </div>
            </section>
        </div>
      </div>
    </motion.div>
  );
};

const SkillBar: React.FC<{ label: string; level: number; color: string }> = ({ label, level, color }) => (
    <div className="mb-4">
        <div className="flex justify-between text-xs font-bold mb-1 font-pixel text-black">
            <span>{label}</span>
            <span>LV.{level}</span>
        </div>
        <div className="w-full h-4 bg-gray-300 border-2 border-black p-[2px]">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${level}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className={`h-full ${color}`}
            />
        </div>
    </div>
);

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onGameWin, onGameLoss, isAdmin }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Motivated and creative 2D and 3D Artist & Animator...";
  
  const [mode, setMode] = useState<'normal' | 'pre-game' | 'playing'>('normal');
  const [showResume, setShowResume] = useState(false);
  
  // Avatar Generator State
  const [showAvatarGen, setShowAvatarGen] = useState(false);
  const [driveInput, setDriveInput] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const displayAvatar = staticAvatar;

  useEffect(() => {
    if (isOpen && mode !== 'playing') {
      setTypedText('');
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isOpen, mode]);

  const handleGenerate = () => {
      const url = convertDriveLink(driveInput);
      if(url) setGeneratedLink(url);
      else alert("Invalid Link");
  };

  const copyCode = () => {
      const code = `const staticAvatar = "${generatedLink}";`;
      navigator.clipboard.writeText(code);
      alert("Copied! Now update components/AboutModal.tsx line 14.");
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          {mode === 'playing' ? (
              <motion.div className="w-full max-w-4xl aspect-video">
                  <BasketballGame onClose={() => setMode('normal')} onWin={() => { if(onGameWin) onGameWin(); setTimeout(() => setMode('normal'), 1000); }} onLoss={() => { if(onGameLoss) onGameLoss(); }} />
              </motion.div>
          ) : (
          <motion.div 
            initial={{ scaleY: 0.01, scaleX: 0, opacity: 0 }}
            animate={{ scaleY: [0.01, 0.01, 1], scaleX: [0, 1, 1], opacity: 1 }}
            className="bg-gray-900 w-full max-w-5xl h-[80vh] border-4 border-accent-light rounded-sm relative flex flex-col overflow-hidden"
          >
            {/* CRT Turn-on effect overlay */}
            <motion.div 
                initial={{ scaleY: 0 }} 
                animate={{ scaleY: 1 }} 
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay opacity-10"
            />
            
            <motion.div onClick={onClose} className="absolute top-4 right-4 z-20 cursor-pointer bg-white rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"><X className="w-6 h-6" /></motion.div>

            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 grid-rows-6 gap-4 font-pixel z-10 relative h-full">
                
                {/* Frame 1: Avatar */}
                <div className="md:col-span-4 md:row-span-4 border-4 border-white bg-black relative overflow-hidden group flex items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                     {mode === 'normal' ? (
                         <div className="w-full h-full relative group/img">
                             <img src={displayAvatar} className="w-full h-full object-cover" />
                             
                             {/* ADMIN OVERLAY */}
                             {isAdmin && (
                                 <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                     <button onClick={() => setShowAvatarGen(true)} className="bg-green-600 text-white px-4 py-2 font-pixel text-xs rounded flex items-center gap-2">
                                         <Code size={14} /> GENERATE LINK
                                     </button>
                                 </div>
                             )}
                         </div>
                     ) : (
                         <div onClick={() => setMode('playing')} className="w-32 h-32 rounded-full bg-orange-500 border-4 border-black cursor-pointer flex items-center justify-center font-bold animate-bounce">PLAY</div>
                     )}
                     <div className="absolute top-2 left-2 flex gap-2 z-20">
                        <button onClick={() => setMode('normal')} className={`px-2 py-1 text-[10px] border-2 border-black ${mode === 'normal' ? 'bg-white text-black' : 'bg-gray-700 text-white'}`}>NORMAL</button>
                        <button onClick={() => setMode('pre-game')} className={`px-2 py-1 text-[10px] border-2 border-black ${mode === 'pre-game' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-white'}`}>GAME</button>
                     </div>
                </div>

                {/* Frame 2: Text */}
                <div className="md:col-span-8 md:row-span-3 border-4 border-white bg-white p-6 relative shadow-[4px_4px_0_rgba(0,0,0,0.5)] overflow-y-auto">
                    <h3 className="text-black text-xl mb-4 font-bold border-b-2 border-black pb-2 flex items-center gap-2">
                        <Zap className="text-yellow-500 fill-yellow-500" size={20}/> About Will
                    </h3>
                    <p className="font-tech text-lg text-black mb-4">{typedText}</p>
                    
                    {/* SKILL BARS */}
                    <div className="mt-6 p-4 bg-gray-100 border-2 border-gray-300 rounded">
                        <SkillBar label="2D DESIGN / ILLUSTRATION" level={78} color="bg-accent-blue" />
                        <SkillBar label="3D MODELING / BLENDER" level={60} color="bg-accent-purple" />
                    </div>
                </div>

                {/* Frame 5: Resume Button */}
                <div className="md:col-span-4 md:row-span-2 col-start-9 row-start-4 flex items-end justify-end">
                    <div className="w-full flex flex-col gap-2">
                         <div className="bg-black/50 p-2 text-white text-[10px] text-center font-tech">CLICK BELOW TO ACCESS DATA</div>
                         <PeelButton text="RESUME" fullWidth onClick={() => setShowResume(true)} />
                    </div>
                </div>
            </div>
          </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>

    {/* AVATAR GENERATOR POPUP */}
    <AnimatePresence>
        {showAvatarGen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4">
                <div className="bg-gray-800 p-6 rounded border border-green-500 w-full max-w-lg">
                    <h3 className="text-green-500 font-pixel mb-4">AVATAR LINK GENERATOR</h3>
                    <input value={driveInput} onChange={e=>setDriveInput(e.target.value)} placeholder="Paste Google Drive Link" className="w-full p-2 bg-black text-white border border-gray-600 mb-2" />
                    <button onClick={handleGenerate} className="bg-green-600 text-white px-4 py-2 mb-4 w-full">CONVERT</button>
                    
                    {generatedLink && (
                        <div className="bg-black p-4 border border-gray-600 text-xs font-mono text-green-400 break-all relative">
                            {generatedLink}
                            <button onClick={copyCode} className="absolute top-2 right-2 bg-white text-black px-2 py-1 text-[10px]">COPY CODE</button>
                        </div>
                    )}
                    <button onClick={() => setShowAvatarGen(false)} className="mt-4 text-gray-500 underline text-xs">CLOSE</button>
                </div>
            </div>
        )}
    </AnimatePresence>

    <AnimatePresence>
        {showResume && <ResumeView onClose={() => setShowResume(false)} avatarUrl={displayAvatar} />}
    </AnimatePresence>
    </>
  );
};

export default AboutModal;
