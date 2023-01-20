import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ESLint from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
	return defineConfig({
		build: {
			lib: {
				name: '@volverjs/ui-vue',
				entry: path.resolve(__dirname, 'src/index.ts'),
			},
			rollupOptions: {
				external: ['vue'],
				output: {
					globals: {
						vue: 'Vue',
					},
				},
			},
		},
		base: mode === 'development' ? './' : '/ui-vue/',
		plugins: [
			vue(),
			ESLint(),
			AutoImport({
				// global imports to register
				imports: ['vue', '@vueuse/core'],
				// Auto import for module exports under directories
				// by default it only scan one level of modules under the directory
				dirs: [
					'./src/composables/**',
					'./src/utils/',
					// './hooks',
					// './composables/**', // all nested modules
					// ...
				],
				dts: true,
				eslintrc: {
					enabled: true,
				},
			})
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				/*
				 * Replace jest-matcher-utils
				 * (required by @storybook/jest) that
				 * creates an error in production
				 * because it use the commonjs module chalk
				 */
				'jest-matcher-utils': path.resolve(
					__dirname,
					'./vendor/jest-matcher-utils/index.ts',
				),
			},
		},
		optimizeDeps: {
			exclude: ['@volverjs/style'],
			force: true,
		},
	})
}
