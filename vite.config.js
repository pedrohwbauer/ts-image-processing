import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@canvas': path.resolve(__dirname, './src/canvas'),
      '@factory': path.resolve(__dirname, './src/factory'),
      '@transform': path.resolve(__dirname, './src/transform'),
    },
  },
})

