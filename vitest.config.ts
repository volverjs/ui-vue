import path from 'node:path'
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
    test: {
        onConsoleLog(log) {
            if (log.includes('decodeEntities'))
                return false
        },
        projects: [
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: '.storybook',
                        tags: {
                            include: [],
                        },
                    }),
                ],
                test: {
                    name: 'storybook',
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
