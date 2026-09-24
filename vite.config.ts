import path from 'node:path'
import ESLint from '@nabla/vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'
import { builtinPresets } from 'unimport'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

// The `vue` preset also declares the types of Vue as globals, and a
// declaration inferred from one of them is emitted as `globalThis.Ref`, a name
// the consumers of the library do not have. The types are imported where they
// are used instead, and so are the ones of `dirs` below.
const vueValues = {
    ...builtinPresets.vue,
    imports: builtinPresets.vue.imports.filter(item =>
        typeof item !== 'object' || Array.isArray(item) || !item.type,
    ),
}

// https://vitejs.dev/config/
export default function viteConfig({ mode }: { mode: string }) {
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
                imports: [vueValues, '@vueuse/core'],
                // Auto import for module exports under directories
                // by default it only scan one level of modules under the directory
                dirs: ['./src/composables/**', './src/utils/'],
                dirsScanOptions: { types: false },
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
