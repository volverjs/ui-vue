import type { Meta, StoryObj } from '@storybook/vue3'
import VvSelect from '@/components/VvSelect/VvSelect.vue'
import { Default } from './Select.stories'
import { defaultArgs, argTypes } from './Select.settings'

const meta: Meta<typeof VvSelect> = {
	title: 'Components/Select/Slots',
	component: VvSelect,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvSelect>

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
