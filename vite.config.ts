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
            rollupOptions: {
                external: ['node:fs', 'node:path', 'yargs', 'yargs/helpers', 'vue', '@vueuse/core', 'dot-prop', 'mitt', 'vue-imask', '@floating-ui/vue', '@iconify/vue', '@iconify/tools', '@iconify/utils', 'chokidar', 'comlink'],
                output: {
                    globals: {
                        'vue': 'Vue',
                        '@vueuse/core': 'VueUse',
                        'dot-prop': 'dotProp',
                        'mitt': 'mitt',
                        'vue-imask': 'VueImask',
                        '@floating-ui/vue': 'FloatingVue',
                        '@iconify/vue': 'Iconify',
                        'comlink': 'Comlink',
                        'node:fs': 'fs',
                        'node:path': 'path',
                        'yargs': 'yargs',
                        'yargs/helpers': 'yargsHelpers',
                        '@iconify/tools': 'IconifyTools',
                        '@iconify/utils': 'IconifyUtils',
                        'chokidar': 'chokidar',
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
        // https://github.com/storybookjs/storybook/issues/25256
        assetsInclude: ['/sb-preview/runtime.js'],
    })
}
