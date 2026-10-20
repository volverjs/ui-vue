import type { ArgTypes } from '@storybook/vue3-vite'

export const defaultArgs = {
    items: Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`),
}

export const argTypes: ArgTypes = {}

// Rows of three heights, none of them the estimate the stories start from
export function createSizedItems() {
    return Array.from({ length: 1000 }, (_, i) => ({
        label: `Item ${i + 1}`,
        height: [40, 80, 120][i % 3],
    }))
}
