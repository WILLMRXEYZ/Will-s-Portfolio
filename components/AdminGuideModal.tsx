
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Terminal, Image as ImageIcon, Code, Copy, CheckCircle, ExternalLink, Cloud, Layout, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// CSS Mockups for visual explanation
const Mockup: React.FC<{ type: 'drive' | 'generator' | 'code' }> = ({ type }) => {
    return (
        <div className="w-full bg-gray-900 border border-gray-700 rounded mb-4 overflow-hidden relative group">
            {type === 'drive' && (
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs bg-black p-2 rounded">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span>My Drive &gt; artwork.jpg</span>
                    </div>
                    <div className="bg-white text-black p-4 rounded shadow-lg relative mt-2 w-3/4 mx-auto">
                        <div className="text-xs font-bold mb-2">Share "artwork.jpg"</div>
                        <div className="bg-gray-100 p-2 rounded flex items-center justify-between">
                            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><Globe size={10}/> Anyone with the link</span>
                            <span className="text-[10px] text-blue-500 font-bold">Viewer</span>
                        </div>
                        <div className="mt-2 bg-blue-500 text-white text-center py-1 rounded text-xs font-bold">Copy Link</div>
                        {/* Cursor */}
                        <div className="absolute bottom-2 right-12 w-3 h-3 bg-black transform rotate-45 border border-white"></div>
                    </div>
                </div>
            )}
            {type === 'generator' && (
                <div className="p-4 bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/><div className="w-2 h-2 rounded-full bg-yellow-500"/><div className="w-2 h-2 rounded-full bg-green-500"/></div>
                        <div className="text-[8px] text-green-500">GENERATOR_TOOL_V1</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-1">
                            <div className="flex-1 h-6 bg-black border border-gray-600 rounded flex items-center px-2 text-[8px] text-gray-400">https://drive.google.com/...</div>
                            <div className="w-12 h-6 bg-green-700 rounded"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-16 h-16 bg-black border border-white flex items-center justify-center text-[8px] text-gray-500">PREVIEW</div>
                            <div className="flex-1 space-y-1">
                                <div className="h-2 bg-gray-600 w-full rounded"></div>
                                <div className="h-2 bg-gray-600 w-2/3 rounded"></div>
                                <div className="h-4 bg-gray-700 w-full mt-2 rounded border border-green-500/50"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {type === 'code' && (
                <div className="p-4 bg-[#1e1e1e] font-mono text-[10px]">
                    <div className="text-gray-500">// data/projects.ts</div>
                    <div className="text-blue-400">export const <span className="text-yellow-400">STATIC_PROJECTS</span> = [</div>
                    <div className="pl-4 text-green-400 opacity-50">...old projects...</div>
                    <div className="pl-4 bg-green-900/30 border-l-2 border-green-500 text-white">
                        {`{ id: 123, imageUrl: "..." },`}
                    </div>
                    <div className="text-blue-400">];</div>
                </div>
            )}
        </div>
    );
};

const AdminGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'en' | 'cn'>('cn');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const t = {
      en: {
          title: "ADMIN MANUAL: GOOGLE DRIVE WORKFLOW",
          intro: "This website is static. We use a 'Host & Paste' method. Images live on Google Drive, and you paste their code here.",
          tabs: ["1. HOST", "2. GENERATE", "3. UPDATE", "4. DEPLOY"],
          
          // Step 1
          s1Title: "Host Image on Drive",
          s1Desc: "Upload your image to Google Drive. Right click the file, select 'Share', and change access to 'Anyone with the link'. Copy the link.",
          
          // Step 2
          s2Title: "Generate Project Code",
          s2Desc: "Log in (Blue Fish footer). Click the Wrench icon -> Code icon. Paste your Drive Link. Adjust size/filters visually. Copy the generated code.",
          
          // Step 3
          s3Title: "Paste Code into App",
          s3Desc: "Open `data/projects.ts`. Scroll to `STATIC_PROJECTS`. Paste your code inside the array. Save the file.",
          
          // Step 4
          s4Title: "Deploy to Web",
          s4Desc: "If using Vercel/Netlify connected to GitHub: Just push your code changes (git push). The site updates automatically.",
          
          close: "CLOSE GUIDE"
      },
      cn: {
          title: "管理员手册：谷歌网盘方案",
          intro: "本站为静态网站，采用“托管+代码”方式。图片存放于谷歌网盘，通过粘贴代码到项目中来显示。",
          tabs: ["1. 托管图片", "2. 生成代码", "3. 粘贴代码", "4. 发布网站"],
          
          // Step 1
          s1Title: "第一步：在网盘托管图片",
          s1Desc: "将图片上传到 Google Drive。右键点击文件 -> 分享 -> 将权限改为“任何拥有链接的人 (Anyone with link)”。复制链接。",
          
          // Step 2
          s2Title: "第二步：生成项目代码",
          s2Desc: "管理员登录 (底部蓝色鱼)。点击顶部的【扳手图标】->【代码图标】打开生成器。粘贴网盘链接，调整图片大小/滤镜。点击“复制代码”。",
          
          // Step 3
          s3Title: "第三步：粘贴到项目中",
          s3Desc: "在代码编辑器中打开 `data/projects.ts`。找到 `STATIC_PROJECTS` 数组。将刚才复制的代码粘贴进去。保存文件。",
          
          // Step 4
          s4Title: "第四步：发布网站",
          s4Desc: "如果你使用 Vercel 或 Netlify：只需将代码提交到 GitHub (git push)。网站会自动重新构建并显示新图片。",
          
          close: "关闭手册"
      }
  };

  const txt = t[lang];

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-gray-900 border-2 border-accent-blue shadow-[0_0_50px_rgba(96,165,250,0.1)] h-[80vh] flex flex-col relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-20"><X size={24} /></button>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-black/50">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 font-pixel">
                    <Terminal className="text-accent-blue" size={20}/> {txt.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-mono">{txt.intro}</p>
            </div>
            <button 
                onClick={() => setLang(l => l === 'en' ? 'cn' : 'en')}
                className="flex items-center gap-2 text-xs font-pixel bg-gray-800 px-3 py-2 rounded text-gray-300 hover:bg-white hover:text-black transition-colors"
            >
                <Globe size={14} /> {lang === 'en' ? '中文' : 'ENGLISH'}
            </button>
        </div>

        {/* Steps Navigation */}
        <div className="flex bg-black border-b border-gray-800">
            {[1, 2, 3, 4].map(i => (
                <button 
                    key={i} 
                    onClick={() => setStep(i)}
                    className={`flex-1 py-4 text-xs font-pixel transition-colors relative ${step === i ? 'text-accent-blue bg-gray-900' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    {txt.tabs[i-1]}
                    {step === i && <div className="absolute bottom-0 left-0 w-full h-1 bg-accent-blue"></div>}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-900/50">
            
            {/* STEP 1: DRIVE */}
            {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-900/30 border border-green-500 rounded flex items-center justify-center text-green-500"><Cloud size={24}/></div>
                        <h3 className="text-2xl font-bold text-white">{txt.s1Title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-300 leading-relaxed mb-4">{txt.s1Desc}</p>
                            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded text-xs text-yellow-500">
                                ⚠️ IMPORTANT: If you do not set "Anyone with the link", the image will NOT show on the website.
                            </div>
                        </div>
                        <div>
                            <Mockup type="drive" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* STEP 2: GENERATOR */}
            {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-900/30 border border-blue-500 rounded flex items-center justify-center text-blue-500"><Layout size={24}/></div>
                        <h3 className="text-2xl font-bold text-white">{txt.s2Title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-300 leading-relaxed mb-4">{txt.s2Desc}</p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex gap-2"><div className="bg-gray-700 px-1 rounded text-white">1</div> Login as Admin</li>
                                <li className="flex gap-2"><div className="bg-gray-700 px-1 rounded text-white">2</div> Click Wrench (Edit Mode)</li>
                                <li className="flex gap-2"><div className="bg-gray-700 px-1 rounded text-white">3</div> Click Code Icon</li>
                            </ul>
                        </div>
                        <div>
                            <Mockup type="generator" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* STEP 3: CODE */}
            {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-900/30 border border-purple-500 rounded flex items-center justify-center text-purple-500"><Code size={24}/></div>
                        <h3 className="text-2xl font-bold text-white">{txt.s3Title}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-gray-300 leading-relaxed mb-4">{txt.s3Desc}</p>
                            <div className="text-xs text-gray-500 mb-2">Location of file:</div>
                            <div className="bg-black p-2 rounded font-mono text-xs text-gray-300 mb-4 border border-gray-700">src/data/projects.ts</div>
                        </div>
                        <div>
                            <Mockup type="code" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* STEP 4: DEPLOY */}
            {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-orange-900/30 border border-orange-500 rounded flex items-center justify-center text-orange-500"><ExternalLink size={24}/></div>
                        <h3 className="text-2xl font-bold text-white">{txt.s4Title}</h3>
                    </div>
                    <div className="p-6 bg-black border border-gray-700 rounded text-center">
                        <Cloud size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-300 leading-relaxed max-w-lg mx-auto">{txt.s4Desc}</p>
                    </div>
                </motion.div>
            )}

        </div>

        <div className="p-4 border-t border-gray-800 flex justify-between bg-black/50">
            <button disabled={step === 1} onClick={() => setStep(s => s - 1)} className="text-gray-500 disabled:opacity-30 hover:text-white px-4">PREV</button>
            <button disabled={step === 4} onClick={() => setStep(s => s + 1)} className="bg-accent-blue text-black px-6 py-2 rounded font-bold hover:bg-white disabled:opacity-0 flex items-center gap-2">NEXT STEP <ArrowRight size={14}/></button>
            {step === 4 && <button onClick={onClose} className="bg-green-500 text-black px-6 py-2 rounded font-bold hover:bg-white">FINISH</button>}
        </div>

      </motion.div>
    </div>
  );
};

export default AdminGuideModal;
