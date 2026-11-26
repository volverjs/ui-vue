import path from 'node:path'
import process from 'node:process'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue', '@vueuse/core'],
            dirs: ['./src/composables/**', './src/utils/'],
            dts: false,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        // Reached only through `useOptions`, an auto-imported composable, so
        // the dependency scan, which reads the sources before the auto-import
        // transform, does not see it. Found in the middle of a run on a cold
        // cache, it made Vite optimize again and reload the page, and the
        // iframe of the browser tester did not come back from the reload:
        // every later file timed out.
        include: ['dot-prop'],
    },
    test: {
        onConsoleLog(log) {
            if (log.includes('decodeEntities'))
                return false
        },
        projects: [
            {
                extends: true,
                root: __dirname,
                plugins: [
                    storybookTest({
                        configDir: path.resolve(__dirname, '.storybook'),
                        tags: {
                            include: [],
                        },
                    }),
                ],
                test: {
                    name: 'storybook',
                    maxWorkers: process.env.CI ? 2 : undefined,
                    fileParallelism: !process.env.CI,
                    browser: {
                        enabled: true,
                        instances: [
                            {
                                browser: 'chromium',
                            },
                        ],
                        provider: playwright(),
                        headless: true,
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
        ],
    },
})
