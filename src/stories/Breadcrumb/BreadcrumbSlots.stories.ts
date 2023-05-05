import type { Meta, StoryObj } from '@storybook/vue3'
import VvBreadcrumb from '@/components/VvBreadcrumb/VvBreadcrumb.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { defaultTest } from './Breadcrumb.test'
import { defaultArgs, argTypes } from './Breadcrumb.settings'

const meta: Meta<typeof VvBreadcrumb> = {
	title: 'Components/Breadcrumb/Slots',
	component: VvBreadcrumb,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvBreadcrumb>

export const Label: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvBreadcrumb, VvIcon },
		setup() {
			return { args }
		},
		template: /*html*/ `
					<VvBreadcrumb v-bind="args">
						<template #label="{route, index}">
							<VvIcon v-if="index === 0" name="home" :aria-label="route.label"  />
							<template v-else>{{ route.label }}</template>
						</template>
					</VvBreadcrumb>
            	`,
	}),
	play: (data) => defaultTest(data, true),
}
