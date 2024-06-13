import type { Meta, StoryObj } from '@storybook/vue3'
import { defaultTest } from './Combobox.test'
import { defaultArgs, argTypes } from './Combobox.settings'
import VvCombobox from '@/components/VvCombobox/VvCombobox.vue'

const meta: Meta<typeof VvCombobox> = {
    title: 'Components/Combobox',
    // @ts-expect-error missing generic components support
    component: VvCombobox,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvCombobox>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvCombobox },
        setup() {
            return { args }
        },
        data: () => ({ inputValue: undefined }),
        template: /* html */ `
			<vv-combobox v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #dropdown::before v-if="args['dropdown::before']"><div class="flex" v-html="args['dropdown::before']"></div></template>
				<template #dropdown::after v-if="args['dropdown::after']"><div class="flex" v-html="args['dropdown::after']"></div></template>
				<template #before v-if="args.before"><div class="flex" v-html="args.before"></div></template>
				<template #after v-if="args.after"><div class="flex" v-html="args.after"></div></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-combobox>
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

export const Unselectable: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        unselectable: true,
    },
}

export const Valid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        valid: true,
        validLabel: 'Selected response is valid.',
    },
}

export const Invalid: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        invalid: true,
        invalidLabel: 'Selected response is invalid.',
    },
}

export const Hint: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        hintLabel: 'Please fill the input above.',
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

export const Searchable: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        searchable: true,
        searchPlaceholder: 'Search...',
    },
}

export const Floating: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        floating: true,
    },
}

export const Native: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        native: true,
    },
}

export const Arrow: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        arrow: true,
        offset: 10,
        triggerWidth: false,
        placement: 'bottom-end',
        dropdownModifiers: 'full-bleed rounded',
    },
}

export const Badges: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        badges: true,
        multiple: true,
    },
}

export const AutoOpen: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        autoOpen: true,
    },
}

export const KeepOpen: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        keepOpen: true,
    },
}

export const autoselectFirst: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        autoselectFirst: true,
    },
}

export const Size: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        'dropdown::before':
			'<div class="bg-brand text-white flex-1 text-center uppercase">Before</div>',
        'dropdown::after':
			'<div class="bg-brand text-white flex-1 text-center uppercase">After</div>',
        'options': Array.from({ length: 30 }, (_, i) => ({
            label: `Option ${i + 1}`,
            value: String(i + 1),
        })),
    },
}
