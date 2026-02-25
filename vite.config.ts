import vinext from 'vinext'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vinext()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
