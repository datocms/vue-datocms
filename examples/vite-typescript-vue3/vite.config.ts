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
  ...(process.env.NODE_ENV !== 'production' && {
    resolve: {
      alias: {
        'vue-datocms': resolve(__dirname, '../../'),
      },
    },
  })
})