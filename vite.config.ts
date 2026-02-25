import vinext from 'vinext'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [vinext()],
  // During production build, the RSC server environment bundles CJS React packages
  // (react-server-dom-webpack) that check process.env.NODE_ENV at runtime to select
  // their dev vs prod variant. Vite does not replace process.env.NODE_ENV in the RSC
  // environment by default, so we must define it explicitly for the build phase only.
  // Without this, the RSC server emits development-only protocol rows (e.g. ":D" debug
  // info) that the production RSC client rejects with a dev/prod mismatch error.
  ...(command === 'build' && {
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  }),
}))
