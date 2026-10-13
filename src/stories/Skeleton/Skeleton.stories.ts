import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvSkeleton from '@/components/VvSkeleton/VvSkeleton.vue'
import { argTypes, defaultArgs } from './Skeleton.settings'
import { defaultTest, shapeTest } from './Skeleton.test'

const meta: Meta<typeof VvSkeleton> = {
    title: 'Components/Skeleton',
    component: VvSkeleton,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvSkeleton>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvSkeleton },
        setup() {
            return { args }
        },
        data: () => ({ loading: args.loading }),
        template: /* html */ `
			<vv-skeleton v-bind="args" :loading="loading">
				<p data-testId="content">Three invoices are waiting for you.</p>
			</vv-skeleton>
			<button type="button" class="vv-button mt-md" data-testId="button" @click="loading = !loading">Toggle</button>
		`,
    }),
    play: defaultTest,
}

export const Loaded: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        loading: false,
    },
}

/**
 * One class for every bar.
 */
export const ItemClass: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        items: 2,
        itemClass: 'max-w-128',
    },
}

/**
 * Bars of a shape of their own through the `skeleton` slot: an avatar
 * beside two lines.
 */
export const Shape: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvSkeleton },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-skeleton v-bind="args">
				<template #skeleton>
					<div class="flex items-center gap-sm">
						<div class="vv-skeleton__item w-28 h-28 rounded-full"></div>
						<div class="vv-skeleton flex-1">
							<div class="vv-skeleton__item max-w-100"></div>
							<div class="vv-skeleton__item max-w-192"></div>
						</div>
					</div>
				</template>
			</vv-skeleton>
		`,
    }),
    play: shapeTest,
}
