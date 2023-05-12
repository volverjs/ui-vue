import type { Meta, StoryObj } from '@storybook/vue3'
import VvCheckbox from '@/components/VvCheckbox/VvCheckbox.vue'
import { defaultArgs, argTypes } from './Checkbox.settings'
import { Default as DefaultStory } from './Checkbox.stories'

const meta: Meta<typeof VvCheckbox> = {
	title: 'Components/Checkbox/Slots',
	component: VvCheckbox,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvCheckbox>

export const Default: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		default: 'DefaultStory <em class="italic">slot!</em>',
	},
}

export const HintSlot: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		hint: 'Hint <em class="italic">slot!</em>',
	},
}
