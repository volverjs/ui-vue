import type { Meta, StoryObj } from '@storybook/vue3'
import VvTextarea from '@/components/VvTextarea/VvTextarea.vue'
import { Default } from './Textarea.stories'
import { defaultArgs, argTypes } from './Textarea.settings'

const meta: Meta<typeof VvTextarea> = {
	title: 'Components/Textarea/Slots',
	component: VvTextarea,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvTextarea>

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
