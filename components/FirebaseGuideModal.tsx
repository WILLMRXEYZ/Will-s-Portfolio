
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Cloud, Settings, Terminal, AlertTriangle, Globe, Image as ImageIcon, Upload, Layout, Wrench, Lock, Check, Fish, Server } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to render CSS-based "Screenshots" since we can't upload actual JPGs
const VisualMockup: React.FC<{ type: 'fish' | 'wrench' | 'upload' | 'deploy' | 'vercel' }> = ({ type }) => {
    return (
        <div className="w-full h-32 bg-gray-800 rounded border border-gray-600 relative overflow-hidden flex items-center justify-center mb-2 shadow-inner group">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]"></div>
            
            {type === 'fish' && (
                <div className="relative w-full h-full bg-black flex flex-col items-center justify-end pb-4">
                    <div className="text-[10px] text-gray-500 mb-2">FOOTER AREA</div>
                    <div className="text-accent-blue animate-bounce">
                         {/* Simple Fish Icon */}
                         <svg width="40" height="24" viewBox="0 0 24 16" fill="currentColor"><path d="M4 2 h4 v2 h-4 z M8 0 h8 v2 h-8 z M16 2 h4 v2 h-4 z M18 4 h4 v4 h-4 z M22 8 h2 v4 h-2 z M18 12 h4 v4 h-4 z M16 12 h-4 v2 h4 z M8 14 h8 v2 h-8 z M4 12 h4 v2 h-4 z M0 4 h4 v8 h-4 z M8 4 h2 v2 h-2 z M8 8 h2 v2 h-2 z" /></svg>
                    </div>
                    <div className="absolute top-2 right-2 border border-red-500 rounded-full w-6 h-6 flex items-center justify-center text-red-500 text-xs animate-pulse">1</div>
                </div>
            )}

            {type === 'wrench' && (
                <div className="relative w-full h-full bg-gray-900 flex flex-col">
                    <div className="w-full h-8 bg-black border-b border-gray-700 flex items-center px-2 gap-2">
                        <div className="w-20 h-4 bg-gray-700 rounded"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded flex items-center justify-center text-black"><Wrench size={10} /></div>
                        <div className="absolute top-1 left-24 border border-red-500 rounded-full w-6 h-6 flex items-center justify-center text-red-500 text-xs animate-pulse bg-black">2</div>
                    </div>
                    <div className="p-2 grid grid-cols-3 gap-2">
                        <div className="bg-gray-700 h-16 rounded opacity-50"></div>
                        <div className="bg-gray-700 h-16 rounded opacity-50"></div>
                        <div className="bg-gray-700 h-16 rounded opacity-50"></div>
                    </div>
                </div>
            )}

            {type === 'upload' && (
                <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                    <div className="bg-black border border-gray-600 p-2 rounded flex items-center gap-2">
                         <div className="bg-green-900/50 border border-green-500 text-green-500 px-2 py-1 rounded text-xs flex items-center gap-1">
                             <Upload size={10} /> UPLOAD
                         </div>
                         <div className="absolute -top-2 -right-2 border border-red-500 rounded-full w-6 h-6 flex items-center justify-center text-red-500 text-xs animate-pulse bg-black">3</div>
                    </div>
                </div>
            )}

            {type === 'deploy' && (
                <div className="relative w-full h-full bg-black flex flex-col items-center justify-center gap-2 font-mono text-[10px]">
                    <div className="text-green-500">> npm run build</div>
                    <div className="w-16 h-1 bg-gray-700 rounded overflow-hidden"><div className="w-2/3 h-full bg-green-500"></div></div>
                    <div className="text-gray-400">dist/ folder ready</div>
                </div>
            )}

            {type === 'vercel' && (
                <div className="relative w-full h-full bg-black flex flex-col items-center justify-center font-sans">
                    {/* Header */}
                    <div className="w-full h-6 border-b border-gray-800 flex items-center justify-between px-2">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div> <span className="text-[8px] font-bold text-white">Vercel</span></div>
                        <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                    </div>
                    {/* Body */}
                    <div className="flex-1 w-full p-4 flex flex-col items-center justify-center gap-2">
                        <div className="w-3/4 h-8 bg-gray-900 border border-gray-700 rounded flex items-center px-2 text-[8px] text-gray-500">
                            github.com/will/portfolio
                        </div>
                        <div className="flex gap-2 w-3/4">
                            <div className="flex-1 h-6 bg-white text-black text-[8px] font-bold flex items-center justify-center rounded">Deploy</div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-[8px] text-gray-400">Building...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FirebaseGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'en' | 'cn'>('cn');
  const [activeTab, setActiveTab] = useState<'setup' | 'upload' | 'deploy' | 'map'>('setup');

  if (!isOpen) return null;

  const t = {
      en: {
          title: "ADMIN MANUAL: CLOUD SYSTEM",
          tabs: {
              setup: "1. FIREBASE SETUP",
              upload: "2. HOW TO UPLOAD",
              deploy: "3. DEPLOYMENT",
              map: "4. DISPLAY MAP"
          },
          // Setup Tab
          setupIntro: "To enable the 'Upload' buttons on this static website, you must link your own Google Firebase backend.",
          step1: "Create Project",
          step1Desc: "Go to console.firebase.google.com. Create a new project named 'Portfolio'.",
          step2: "Enable Database",
          step2Desc: "Build > Firestore Database > Create > Start in Test Mode.",
          step3: "Enable Storage",
          step3Desc: "Build > Storage > Get Started > Start in Test Mode.",
          step4: "Get Config",
          step4Desc: "Project Settings (Gear Icon) > General > Your Apps > Web (</>) > Register App > Copy Config.",
          step5: "Paste Code",
          step5Desc: "Paste the config object into `utils/fire.ts`.",
          
          // Upload Tab
          upTitle: "Uploading Images to Cloud",
          upStep1: "Login as Admin",
          upStep1Desc: "Scroll to the bottom footer. Click the Blue Fish animation. Enter credentials (Default: WILLMRXEYZ / liuzhi2005).",
          upStep2: "Enter Edit Mode",
          upStep2Desc: "In 'Work Section', click the Wrench Icon (Top Right) to unlock tools.",
          upStep3: "Upload File",
          upStep3Desc: "Click the 'UPLOAD' button. Select an image/video. It will upload to Firebase Storage and appear instantly.",
          upNote: "This works for both Portfolio Gallery and About Me Avatar.",

          // Deploy Tab
          depTitle: "Publishing to Public Web",
          depIntro: "Since the images are hosted on Firebase, you can host this website anywhere.",
          depMethod1: "Option A: Vercel / Netlify (Recommended)",
          depMethod1Desc: "1. Push this code to GitHub.\n2. Connect GitHub repo to Vercel/Netlify.\n3. It will auto-detect settings. Click 'Deploy'.\n4. Your site is live! Images loaded from Firebase.",
          depMethod2: "Option B: GitHub Pages",
          depMethod2Desc: "Run `npm run build`. Upload the contents of `dist` folder to a gh-pages branch.",
          depAccess: "Global Access",
          depAccessDesc: "Once deployed, anyone accessing your URL (e.g., your-name.vercel.app) will see the images you uploaded via the Admin panel.",

          // Map Tab
          mapTitle: "Where does data go?",
          mapGallery: "Portfolio Gallery",
          mapGalleryDesc: "Stored in 'projects' collection. Images in 'uploads/' storage folder.",
          mapAvatar: "About Me Avatar",
          mapAvatarDesc: "Stored in 'settings/avatar' document. Image in 'avatar/' storage folder.",
          mapResume: "Resume Photo",
          mapResumeDesc: "Automatically uses the same 'About Me' avatar.",

          close: "CLOSE MANUAL"
      },
      cn: {
          title: "管理员手册：云端系统配置",
          tabs: {
              setup: "1. Firebase 设置",
              upload: "2. 如何上传图片",
              deploy: "3. 网站部署指南",
              map: "4. 显示区域说明"
          },
          // Setup Tab
          setupIntro: "本网站为静态网站。为了使用“上传”功能并让所有人看到图片，必须连接 Google Firebase 后端。",
          step1: "创建项目",
          step1Desc: "访问 console.firebase.google.com。新建项目，命名为 'Portfolio'。",
          step2: "启用数据库",
          step2Desc: "左侧菜单：构建 (Build) > Firestore Database > 创建 > 选择【测试模式 (Test Mode)】。",
          step3: "启用存储",
          step3Desc: "左侧菜单：构建 (Build) > Storage > 开始使用 > 选择【测试模式 (Test Mode)】。",
          step4: "获取密钥",
          step4Desc: "点击左上角齿轮 (项目设置) > 常规 > 您的应用 > 点击 Web (</>) 图标 > 注册应用 > 复制 Config 代码。",
          step5: "粘贴代码",
          step5Desc: "将复制的代码覆盖粘贴到本项目中的 `utils/fire.ts` 文件内。",

          // Upload Tab
          upTitle: "上传图片操作流程",
          upStep1: "管理员登录",
          upStep1Desc: "滑动到网页最底部 (Contact 区域)。点击游动的蓝色像素鱼。输入账号密码 (默认: WILLMRXEYZ / liuzhi2005)。",
          upStep2: "进入编辑模式",
          upStep2Desc: "登录后，在作品展示区 (Work Section) 顶部会出现一个扳手图标。点击它解锁编辑工具。",
          upStep3: "上传文件",
          upStep3Desc: "点击绿色的 'UPLOAD' 按钮。选择图片或视频。文件会自动上传到云端并立即显示在网页上。",
          upNote: "此流程适用于【作品集展示】和【About Me 头像】。",

          // Deploy Tab
          depTitle: "如何发布到公开网络",
          depIntro: "由于图片存储在 Firebase 云端，你可以将此网站代码托管在任何静态网页服务上。",
          depMethod1: "方法 A: Vercel / Netlify (推荐)",
          depMethod1Desc: "1. 将代码上传到 GitHub。\n2. 在 Vercel/Netlify 官网登录并连接你的 GitHub 仓库。\n3. 点击部署 (Deploy)。系统会自动识别构建设置。\n4. 部署成功后，你会获得一个公开网址，任何人访问都能看到你的作品。",
          depMethod2: "方法 B: GitHub Pages",
          depMethod2Desc: "在本地终端运行 `npm run build`。将生成的 `dist` 文件夹内容上传到 GitHub Pages 分支。",
          depAccess: "全球访问",
          depAccessDesc: "部署成功后，任何人访问你的网址 (例如 your-site.vercel.app) 都能看到你通过管理员后台上传的图片。",

          // Map Tab
          mapTitle: "数据存储位置说明",
          mapGallery: "作品展示区 (Work)",
          mapGalleryDesc: "数据存放在 Firestore 的 'projects' 集合中。图片文件存放在 Storage 的 'uploads/' 文件夹。",
          mapAvatar: "个人头像 (About)",
          mapAvatarDesc: "数据存放在 Firestore 的 'settings/avatar' 文档中。图片文件存放在 Storage 的 'avatar/' 文件夹。",
          mapResume: "简历照片 (Resume)",
          mapResumeDesc: "自动同步使用【个人头像】的图片，无需单独上传。",

          close: "关闭手册"
      }
  };

  const txt = t[lang];

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-gray-900 border-2 border-accent-blue shadow-[0_0_50px_rgba(96,165,250,0.1)] h-[85vh] flex flex-col md:flex-row overflow-hidden rounded"
      >
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-black border-r border-gray-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-800 flex items-center gap-2">
                <Terminal className="text-accent-blue" size={20} />
                <span className="font-pixel text-xs text-white tracking-widest">SYSTEM_MANUAL</span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {(Object.keys(txt.tabs) as Array<keyof typeof txt.tabs>).map((key) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`w-full text-left px-4 py-4 font-tech text-sm border-b border-gray-800 transition-colors flex items-center justify-between ${activeTab === key ? 'bg-accent-blue/20 text-accent-blue border-l-4 border-l-accent-blue' : 'text-gray-500 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <span>{txt.tabs[key]}</span>
                        {activeTab === key && <Check size={14} />}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-800">
                <button 
                    onClick={() => setLang(l => l === 'en' ? 'cn' : 'en')}
                    className="w-full flex items-center justify-center gap-2 text-xs font-pixel bg-gray-800 py-2 rounded text-gray-300 hover:bg-white hover:text-black transition-colors"
                >
                    <Globe size={14} /> {lang === 'en' ? 'SWITCH TO 中文' : 'SWITCH TO ENGLISH'}
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full bg-gray-900/50 relative">
            <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white bg-black/50 p-2 rounded-full"><X size={20} /></button>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                
                {/* === TAB 1: SETUP === */}
                {activeTab === 'setup' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Database className="text-accent-blue"/> {txt.tabs.setup}</h2>
                            <p className="text-gray-400">{txt.setupIntro}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: txt.step1, desc: txt.step1Desc, icon: <Layout /> },
                                { title: txt.step2, desc: txt.step2Desc, icon: <Database />, warn: true },
                                { title: txt.step3, desc: txt.step3Desc, icon: <Cloud />, warn: true },
                                { title: txt.step4, desc: txt.step4Desc, icon: <Settings /> },
                                { title: txt.step5, desc: txt.step5Desc, icon: <Terminal /> }
                            ].map((step, i) => (
                                <div key={i} className="bg-black border border-gray-700 p-4 rounded flex gap-4 items-start">
                                    <div className="p-2 bg-gray-800 rounded text-accent-blue shrink-0">{step.icon}</div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                                        {step.warn && <div className="mt-2 text-[10px] text-yellow-500 flex items-center gap-1"><AlertTriangle size={10} /> REQUIRED: Test Mode</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* === TAB 2: UPLOAD === */}
                {activeTab === 'upload' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Upload className="text-green-500"/> {txt.upTitle}</h2>
                            <p className="text-gray-400 text-sm border-l-2 border-green-500 pl-4 bg-green-900/10 py-2">{txt.upNote}</p>
                        </div>

                        <div className="space-y-6">
                            {/* Step 1 */}
                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
                                <h3 className="text-white font-bold mb-2 flex justify-between">
                                    <span>STEP 01: {txt.upStep1}</span>
                                    <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-1 rounded">FOOTER</span>
                                </h3>
                                <VisualMockup type="fish" />
                                <p className="text-sm text-gray-400">{txt.upStep1Desc}</p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
                                <h3 className="text-white font-bold mb-2 flex justify-between">
                                    <span>STEP 02: {txt.upStep2}</span>
                                    <span className="text-[10px] bg-yellow-900 text-yellow-200 px-2 py-1 rounded">WORK SECTION</span>
                                </h3>
                                <VisualMockup type="wrench" />
                                <p className="text-sm text-gray-400">{txt.upStep2Desc}</p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
                                <h3 className="text-white font-bold mb-2 flex justify-between">
                                    <span>STEP 03: {txt.upStep3}</span>
                                    <span className="text-[10px] bg-green-900 text-green-200 px-2 py-1 rounded">ACTION</span>
                                </h3>
                                <VisualMockup type="upload" />
                                <p className="text-sm text-gray-400">{txt.upStep3Desc}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* === TAB 3: DEPLOY === */}
                {activeTab === 'deploy' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Globe className="text-purple-500"/> {txt.depTitle}</h2>
                            <p className="text-gray-400">{txt.depIntro}</p>
                        </div>

                        <VisualMockup type="deploy" />

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-black border border-purple-500/30 p-6 rounded relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-bl">RECOMMENDED</div>
                                <h3 className="text-lg font-bold text-white mb-2">{txt.depMethod1}</h3>
                                <VisualMockup type="vercel" />
                                <pre className="text-sm text-gray-400 font-mono whitespace-pre-wrap leading-relaxed mt-4">{txt.depMethod1Desc}</pre>
                            </div>

                            <div className="bg-black border border-gray-700 p-6 rounded">
                                <h3 className="text-lg font-bold text-white mb-2">{txt.depMethod2}</h3>
                                <pre className="text-sm text-gray-400 font-mono whitespace-pre-wrap leading-relaxed">{txt.depMethod2Desc}</pre>
                            </div>

                            <div className="bg-green-900/10 border border-green-500/30 p-4 rounded flex items-start gap-3">
                                <Globe className="text-green-500 shrink-0 mt-1" />
                                <div>
                                    <h4 className="text-white font-bold text-sm">{txt.depAccess}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{txt.depAccessDesc}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                 {/* === TAB 4: MAP === */}
                 {activeTab === 'map' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Server className="text-orange-500"/> {txt.mapTitle}</h2>
                        </div>

                        <div className="relative">
                            {/* Diagram Lines */}
                            <div className="absolute left-4 top-8 bottom-8 w-1 bg-gray-700"></div>

                            <div className="space-y-6 pl-10 relative">
                                {/* Node 1 */}
                                <div className="relative bg-gray-800 p-4 rounded border border-gray-600">
                                    <div className="absolute w-8 h-1 bg-gray-700 -left-10 top-1/2"></div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <ImageIcon className="text-accent-blue" />
                                        <h3 className="text-white font-bold">{txt.mapGallery}</h3>
                                    </div>
                                    <div className="text-xs font-mono text-gray-400 bg-black p-2 rounded">
                                        <p className="text-orange-400">DB: collections("projects")</p>
                                        <p className="text-blue-400">STORAGE: /uploads/img_*.jpg</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{txt.mapGalleryDesc}</p>
                                </div>

                                {/* Node 2 */}
                                <div className="relative bg-gray-800 p-4 rounded border border-gray-600">
                                    <div className="absolute w-8 h-1 bg-gray-700 -left-10 top-1/2"></div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-600 border border-white"></div>
                                        <h3 className="text-white font-bold">{txt.mapAvatar}</h3>
                                    </div>
                                    <div className="text-xs font-mono text-gray-400 bg-black p-2 rounded">
                                        <p className="text-orange-400">DB: doc("settings/avatar")</p>
                                        <p className="text-blue-400">STORAGE: /avatar/profile_*.jpg</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{txt.mapAvatarDesc}</p>
                                </div>

                                 {/* Node 3 */}
                                 <div className="relative bg-gray-800 p-4 rounded border border-gray-600">
                                    <div className="absolute w-8 h-1 bg-gray-700 -left-10 top-1/2"></div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lock className="text-red-400" size={16} />
                                        <h3 className="text-white font-bold">{txt.mapResume}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500">{txt.mapResumeDesc}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
            
            <div className="p-4 border-t border-gray-800 flex justify-end bg-black/50">
                <button onClick={onClose} className="px-6 py-2 bg-white text-black font-pixel text-xs hover:bg-accent-blue transition-colors">
                    {txt.close}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FirebaseGuideModal;
