import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  // This example is also deployed in production as a demo. So, we need 
  // to sligthly tweak the setup:
  // 
  // - in development mode, we need to resolve to the grand-parent folder,
  //   where the version of vue-datocms under development currently lives;
  // - in production, instead, vue-datocms is actually a normal dependency,
  //   so we don't need any special setup here. 
  ...(process.env.NODE_ENV !== 'production' && {
    resolve: {
      alias: {
        'vue-datocms': resolve(__dirname, '../../'),
      },
    },
  })
})