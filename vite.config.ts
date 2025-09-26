import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

const nonHashFiles = [
    'woff',
    'woff2',
    'svg',
    'ttf',
    'eot',
]


// Detect deployment environment
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  base: isGitHubPages ? '/math-notes/' : '/',
  // If on Vercel, always use root
  ...(isVercel && { base: '/' }),
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          if (nonHashFiles.some(ext => assetInfo.name.endsWith(`.${ext}`)))
            return 'assets/[name].[ext]'
          return 'assets/[name]-[hash].[ext]'
        }
      }
    }
  }
})