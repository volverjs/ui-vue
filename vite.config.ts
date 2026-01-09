import path from 'node:path'
import ESLint from '@nabla/vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
    return defineConfig({
        build: {
            lib: {
                name: '@volverjs/ui-vue',
                entry: path.resolve(__dirname, 'src/index.ts'),
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
                dirs: ['./src/composables/**', './src/utils/'],
                dts: true,
                eslintrc: {
                    enabled: true,
                },
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        optimizeDeps: {
            exclude: ['@volverjs/style'],
            force: true,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    quietDeps: true,
                },
            },
        },
        // https://github.com/storybookjs/storybook/issues/25256
        assetsInclude: ['/sb-preview/runtime.js'],
    })
}
