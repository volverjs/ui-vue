import type { Meta, StoryObj } from '@storybook/vue3'
import VvRadio from '@/components/VvRadio/VvRadio.vue'
import { defaultArgs, argTypes } from './Radio.settings'
import { Default as DefaultStory } from './Radio.stories'

const meta: Meta<typeof VvRadio> = {
	title: 'Components/Radio/Slots',
	component: VvRadio,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvRadio>

export const Default: Story = {
	...DefaultStory,
	args: {
		...DefaultStory.args,
		default: 'DefaultStory <em class="italic">slot!</em>',
	},
}

export const HintSlot: Story = {
	...DefaultStory,
	args: {
		...DefaultStory.args,
		hint: 'Hint <em class="italic">slot!</em>',
	},
}
