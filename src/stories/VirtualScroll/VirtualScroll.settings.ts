import type { ArgTypes } from 'storybook/internal/types'

export const defaultArgs = {
    items: Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`),
}

export const argTypes: ArgTypes = {}
