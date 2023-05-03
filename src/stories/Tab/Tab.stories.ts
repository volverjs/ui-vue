import type { Meta, StoryObj } from '@storybook/vue3'
import VvTab from '@/components/VvTab/VvTab.vue'
import { defaultArgs, defaultArgTypes } from './Tab.settings'
import { defaultTest } from './Tab.test'

const meta: Meta<typeof VvTab> = {
	title: 'Components/Tab',
	component: VvTab,
	args: defaultArgs,
	argTypes: defaultArgTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvTab>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: {VvTab},
		setup() {
			return {args}
		},
		template: /* html */ `
			<div class="m-md w-1/2">
				<vv-tab v-bind="args" data-testId="element">
					<template #tab-item_0>
						<span class="text-20 font-semibold">Tab 1</span>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
							vitae elit libero, a pharetra augue. Nullam id dolor id nibh
							ultricies vehicula ut id elit. Morbi leo risus, porta ac
							consectetur ac, vestibulum at eros. Praesent commodo cursus
							magna, vel scelerisque nisl consectetur et. Donec sed odio dui.
							Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae
							elit libero, a pharetra augue.
						</p>
					</template>
					<template #tab-item_1>
						<span class="text-20 font-semibold">Tab 2</span>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
							vitae elit libero, a pharetra augue. Nullam id dolor id nibh
							ultricies vehicula ut id elit. Morbi leo risus, porta ac
							consectetur ac, vestibulum at eros. Praesent commodo cursus
							magna, vel scelerisque nisl consectetur et. Donec sed odio dui.
							Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae
							elit libero, a pharetra augue.
						</p>
					</template>
					<template #tab-3>
						<span class="text-20 font-semibold">Tab 3</span>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
							vitae elit libero, a pharetra augue. Nullam id dolor id nibh
							ultricies vehicula ut id elit. Morbi leo risus, porta ac
							consectetur ac, vestibulum at eros. Praesent commodo cursus
							magna, vel scelerisque nisl consectetur et. Donec sed odio dui.
							Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae
							elit libero, a pharetra augue.
						</p>
					</template>
				</vv-tab>
			</div>`
	}),
	play: defaultTest,
}
