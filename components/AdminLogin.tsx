
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, X, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLogin: React.FC<Props> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const ADMIN_USER = "WILLMRXEYZ";
  const ADMIN_PASS = "liuzhi2005"; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onLogin();
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border-2 border-accent-blue p-8 relative shadow-[0_0_50px_rgba(96,165,250,0.2)]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black border-2 border-accent-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-accent-blue" size={32} />
          </div>
          <h2 className="font-pixel text-xl text-white mb-2">ADMIN ACCESS</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
             <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500"><User size={16} /></div>
             <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-gray-700 p-4 pl-12 font-mono text-white focus:border-accent-blue focus:outline-none"
              placeholder="USERNAME"
              autoFocus
            />
          </div>

          <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500"><Lock size={16} /></div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 p-4 pl-12 font-mono text-white focus:border-accent-blue focus:outline-none"
              placeholder="PASSWORD"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 font-pixel text-sm flex items-center justify-center gap-2 mt-4 ${error ? 'bg-red-600 text-white' : 'bg-accent-blue text-black hover:bg-white'}`}
          >
            {error ? 'ACCESS DENIED' : <><Unlock size={16} /> UNLOCK SYSTEM</>}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
