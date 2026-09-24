import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { argTypes, defaultArgs } from './InputFile.settings'
import { ariaLabelTest } from './InputFile.test'

const meta: Meta = {
    title: 'Components/InputFile',
    component: VvInputFile,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvInputFile },
        setup() {
            const files = ref([])
            return {
                args,
                files,
            }
        },
        template: /* html */ `
			<vv-input-file v-bind="args" v-model="files">
				<template #drop-area v-if="args.dropAreaSlot"><div v-html="args.dropAreaSlot"></div></template>
				<template #hint v-if="args['hint']"><div v-html="args['hint']"></div></template>
			</vv-input-file>
		`,
    }),
}

export const Readonly: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        readonly: true,
    },
}

export const Disabled: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        disabled: true,
    },
}

export const Valid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        valid: true,
        validLabel: 'The field is valid.',
    },
}

export const Invalid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        invalid: true,
        invalidLabel: 'The field is required.',
    },
}

export const Hint: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        hintLabel: 'Please upload a file.',
    },
}

export const Loading: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        loading: true,
        loadingLabel: 'Loading...',
    },
}

export const Progress: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        progress: 30,
        hintLabel: '30%',
    },
}

/**
 * A file input with no visible label, next to a heading that already says
 * what to attach, named by `aria-label` instead, with help text the page
 * already draws.
 */
export const AriaLabel: Story = {
    args: {
        ...defaultArgs,
        label: undefined,
        hintLabel: 'PDF, up to 10 MB.',
    },
    render: args => ({
        components: { VvInputFile },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div>
				<span id="extra-help">The invoice of the order you are returning.</span>
				<vv-input-file v-bind="args" aria-label="Attach the invoice" aria-describedby="extra-help" data-testId="element" />
			</div>
		`,
    }),
    play: ariaLabelTest,
}
