import { nitro } from 'nitro/vite'
import vinext from 'vinext'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [vinext(), command === 'build' && nitro()],
}))
