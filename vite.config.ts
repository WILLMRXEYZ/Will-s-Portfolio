import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        // ⭐ 新增或修改 'base' 属性
        // 必须与你的 GitHub 仓库名称完全匹配，并且前后都有斜杠 '/'
        base: '/Will-s-Portfolio/',
        
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                // 确保你的 alias 路径是正确的，'@' 解析到项目根目录
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});