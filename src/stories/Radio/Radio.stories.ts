import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvRadio from '@/components/VvRadio/VvRadio.vue'
import { argTypes, defaultArgs } from './Radio.settings'
import { ariaLabelTest, defaultTest, longLabelTest } from './Radio.test'

const meta: Meta<typeof VvRadio> = {
    title: 'Components/Radio',
    component: VvRadio,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvRadio>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvRadio },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
			<vv-radio v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-radio>
			<div>Value: <span data-testId="value">{{inputValue}}</span></div> 
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

export const Invalid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        invalid: true,
        invalidLabel: 'You must accept terms and conditions',
        label: 'Accept terms and conditions',
    },
}

export const Valid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        valid: true,
        validLabel: 'Thank you for accepting terms and conditions',
        label: 'Accept terms and conditions',
    },
}

export const Hint: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        hintLabel: 'Please accept terms and conditions',
    },
}

export const LongLabel: Story = {
    args: {
        ...defaultArgs,
        label: 'I agree to the terms and conditions, the privacy policy and the processing of my personal data',
    },
    render: args => ({
        components: { VvRadio },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        // Narrow enough that the label cannot fit on the line of the control,
        // which is the width at which it used to drop below it.
        template: /* html */ `
			<div style="max-width: 220px">
				<vv-radio v-bind="args" v-model="inputValue" data-testId="element" />
			</div>
		`,
    }),
    play: longLabelTest,
}

/**
 * A radio with no visible label, whose option is drawn elsewhere in the row,
 * named by `aria-label` instead, with help text the page already draws.
 */
export const AriaLabel: Story = {
    args: {
        ...defaultArgs,
        label: undefined,
        hintLabel: 'Delivered in 3 to 5 days.',
    },
    render: args => ({
        components: { VvRadio },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div>
				<span id="extra-help">Free above 50 euros.</span>
				<vv-radio v-bind="args" aria-label="Standard shipping" aria-describedby="extra-help" data-testId="element" />
			</div>
		`,
    }),
    play: ariaLabelTest,
}
