import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/monopoly_console/', // 設定專案的基礎路徑，需與 GitHub 專案名稱一致
})
