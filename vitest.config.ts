import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig({ mode: 'test' }),
    defineConfig({
        plugins: [
            storybookTest({
                configDir: '.storybook',
                tags: {
                    include: ['test'],
                },
            }),
        ],
        test: {
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
            onConsoleLog(log) {
                if (log.includes('decodeEntities'))
                    return false
            },
        },
    }),
)
