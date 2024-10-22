import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  optimizeDeps: {
    exclude: [
      'chunk-A2SJYFYN.js',
      'chunk-KV22RJOG.js',
      'chunk-SSLMVLZX.js'
    ]
  }

})
