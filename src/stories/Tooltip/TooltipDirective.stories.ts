import type { Meta, StoryObj } from '@storybook/vue3'
import VvTooltip from '@/components/VvTooltip/VvTooltip.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { defaultArgs, argTypes } from './Tooltip.settings'
import { defaultTest } from './Tooltip.test'

const meta: Meta<typeof VvTooltip> = {
	title: 'Directives/Tooltip',
	component: VvTooltip,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvTooltip>

export const DefaultDirective: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvButton, VvTooltip },
		setup() {
			return { args }
		},
		template: /* html */ `
			<div class="w-full h-150">
				<vv-button v-tooltip:[args.position]="args.value" class="absolute left-1/2 top-1/2 -translate-1/2" data-testId="parent">
					HOVER Me
				</vv-button>
			</div>
		`,
	}),
	play: defaultTest,
}

export const Top: Story = {
	...DefaultDirective,
	args: {
		...DefaultDirective.args,
		position: 'top',
	},
}

export const Bottom: Story = {
	...DefaultDirective,
	args: {
		...DefaultDirective.args,
		position: 'bottom',
	},
}

export const Right: Story = {
	...DefaultDirective,
	args: {
		...DefaultDirective.args,
		position: 'right',
	},
}

export const Left: Story = {
	...DefaultDirective,
	args: {
		...DefaultDirective.args,
		position: 'left',
	},
}
