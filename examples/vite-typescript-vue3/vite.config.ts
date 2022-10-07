import { resolve } from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },  
  resolve: {
    alias: {
      'vue-datocms': resolve(__dirname, '../../'),
    },
  },
})