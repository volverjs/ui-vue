import type { Meta } from '@storybook/vue3'
import VvAlertGroup from '@/components/VvAlertGroup/VvAlertGroup.vue'
import { defaultArgs, argTypes } from './AlertGroup.settings'
import { Default, type Story } from './AlertGroup.stories'

const meta: Meta<typeof VvAlertGroup> = {
	title: 'Components/AlertGroup/Position',
	component: VvAlertGroup,
	args: defaultArgs,
	argTypes,
}

export default meta

export const TopStart: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'top',
		inline: 'start',
	},
}

export const TopMiddle: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'top',
		inline: 'middle',
	},
}

export const TopEnd: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'top',
		inline: 'end',
	},
}

export const CenterStart: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'center',
		inline: 'start',
	},
}

export const CenterMiddle: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'center',
		inline: 'middle',
	},
}

export const CenterEnd: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'center',
		inline: 'end',
	},
}

export const BottomStart: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'bottom',
		inline: 'start',
	},
}

export const BottomMiddle: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'bottom',
		inline: 'middle',
	},
}

export const BottomEnd: Story = {
	...Default,
	args: {
		...defaultArgs,
		position: 'absolute',
		block: 'bottom',
		inline: 'end',
	},
}
