import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import { Default } from './Button.stories'
import { argTypes, defaultArgs } from './Button.settings'


const meta: Meta<typeof VvButton> = {
	title: 'Components/Button/Modifiers',
	component: VvButton,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvButton>

export const Primary: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Primary',
		modifiers: 'primary',
	},
}

export const Secondary: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Secondary',
		modifiers: 'secondary',
	},
}

export const Danger: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Danger',
		modifiers: 'danger',
	},
}

export const Ghost: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Ghost',
		modifiers: 'ghost',
	},
}

export const Link: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Link',

		modifiers: 'link',
	},
}

export const StaticLight: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Static light',
		modifiers: 'static-light',
	},
	render: (args) => ({
		components: { VvButton },
		backgrounds: {
			default: 'dark',
		},
		setup() {
			return { args }
		},
		template: /*html*/ `
			<div class="bg-black p-md">
				<vv-button v-bind="args" data-testId="element" />
			</div>
		`,
	})

}


export const StaticDark: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Static light',
		modifiers: 'static-light',
	},
	render: (args) => ({
		components: { VvButton },
		backgrounds: {
			default: 'dark',
		},
		setup() {
			return { args }
		},
		template: /*html*/ `
			<div class="bg-white p-md">
				<vv-button v-bind="args" data-testId="element" />
			</div>
		`,
	})
}

export const Block: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Block',
		modifiers: 'block',
	},
}

export const Rounded: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Rounded',
		modifiers: 'rounded',
	},
}

export const FullBleed: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Full bleed',

		modifiers: 'full-bleed',
	},
}


export const Action: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Action',
		modifiers: 'action',
	},
}

export const ActionQuiet: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Action quiet',

		modifiers: 'action-quiet',
	},
}
