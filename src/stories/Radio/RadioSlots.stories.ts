import type { Meta, StoryObj } from '@storybook/vue3'
import VvRadio from '@/components/VvRadio/VvRadio.vue'
import { defaultArgs, argTypes } from './Radio.settings'
import { Default } from './Radio.stories'

const meta: Meta<typeof VvRadio> = {
	title: 'Components/Radio/Slots',
	component: VvRadio,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvRadio>

export const DefaultSlot: Story = {
	...Default,
	args: {
		...Default.args,
		default: 'Default <em class="italic">slot!</em>',
	},
}

export const HintSlot: Story = {
	...Default,
	args: {
		...Default.args,
		hint: 'Hint <em class="italic">slot!</em>',
	},
}
