import vinext from 'vinext'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [vinext()],
  // During production build, the RSC server bundles CJS React packages
  // (react-server-dom-webpack) that check process.env.NODE_ENV at runtime to select
  // their dev vs prod variant. Vite does not replace process.env.NODE_ENV in the RSC
  // environment by default, so we must define it explicitly for the build phase only.
  // Without this, the RSC server emits development-only protocol rows that the
  // production RSC client rejects with a dev/prod mismatch error.
  ...(command === 'build' && {
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  }),
  environments: {
    client: {
      optimizeDeps: {
        // Crawl all app source files at startup so Vite pre-bundles all client deps
        // upfront, eliminating lazy-discovery re-optimization cascades on first boot.
        entries: ['app/**/*.{tsx,ts,jsx,js}'],
        // Explicitly include JSX runtime so Vite pre-bundles them (CJS→ESM).
        // Without this, raw CJS is served to the browser causing module export errors.
        include: ['react/jsx-runtime', 'react/jsx-dev-runtime'],
      },
    },
  },
}))
