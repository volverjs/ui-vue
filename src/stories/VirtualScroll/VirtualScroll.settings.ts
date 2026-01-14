import type { ArgTypes } from '@storybook/vue3-vite'

export const defaultArgs = {
    items: Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`),
}

export const argTypes: ArgTypes = {}
