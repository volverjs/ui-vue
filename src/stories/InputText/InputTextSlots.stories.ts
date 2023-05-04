import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { Default } from './InputText.stories'
import { defaultArgs, argTypes } from './InputText.settings'

const meta: Meta<typeof VvInputText> = {
	title: 'Components/InputText/Slots',
	component: VvInputText,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const Before: Story = {
	...Default,
	args: {
		...Default.args,
		before: '<div class="vv-badge vv-badge--sm uppercase">Before</div>',
	},
}

export const After: Story = {
	...Default,
	args: {
		...Default.args,
		after: '<div class="vv-badge vv-badge--sm uppercase">After</div>',
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...Default.args,
		hint: 'Hint <em class="italic">slot!</em>',
	},
}
