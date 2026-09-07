import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputRange from '@/components/VvInputRange/VvInputRange.vue'
import { argTypes, defaultArgs } from './InputRange.settings'
import {
    ariaDescribedbyTest,
    ariaLabelTest,
    debouncedTest,
    defaultTest,
    tinyStepTest,
} from './InputRange.test'

const meta: Meta<typeof VvInputRange> = {
    title: 'Components/InputRange',
    component: VvInputRange,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvInputRange>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvInputRange },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
			<vv-input-range v-bind="args" v-model="inputValue" data-testId="element">
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-input-range>
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: defaultTest,
}

export const Disabled: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        disabled: true,
    },
}

export const Readonly: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        readonly: true,
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
        invalidLabel: 'The value is too high.',
    },
}

export const Hint: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        hintLabel: 'Drag the slider to set the value.',
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

export const Unit: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        unit: '%',
    },
}

export const WithoutValue: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        showValue: false,
    },
}

export const AriaLabel: Story = {
    args: {
        ...defaultArgs,
        label: undefined,
    },
    render: args => ({
        components: { VvInputRange },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
			<div>
				<span id="extra-help">Between silence and the neighbours complaining.</span>
				<vv-input-range v-bind="args" v-model="inputValue" aria-label="Volume" aria-describedby="extra-help" data-testId="element" />
			</div>
		`,
    }),
    play: ariaLabelTest,
}

export const AriaDescribedby: Story = {
    args: {
        ...defaultArgs,
        hintLabel: 'Drag the slider to set the value.',
    },
    render: args => ({
        components: { VvInputRange },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
			<div>
				<span id="extra-help">Between silence and the neighbours complaining.</span>
				<vv-input-range v-bind="args" v-model="inputValue" aria-describedby="extra-help" data-testId="element" />
			</div>
		`,
    }),
    play: ariaDescribedbyTest,
}

export const TinyStep: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        min: 0,
        max: 0.000001,
        step: 0.0000001,
    },
    play: tinyStepTest,
}

export const Debounce: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        debounce: 300,
    },
    play: debouncedTest,
}
