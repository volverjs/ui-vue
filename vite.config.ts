import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			name: 'Volverjs ui-vue',
			entry: path.resolve(__dirname, 'src/main.ts')
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue'
				}
			}
		}
	},
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
