import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-a11y',
        '@vueless/storybook-dark-mode',
        '@storybook/addon-docs',
    ],

    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },

    staticDirs: ['./static'],
}

export default config
