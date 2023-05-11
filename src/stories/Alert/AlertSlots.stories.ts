import type { Meta } from '@storybook/vue3'
import VvAlert from '@/components/VvAlert/VvAlert.vue'
import { defaultArgs, argTypes } from './Alert.settings'
import { Default as DefaultStory, type Story } from './Alert.stories'

const meta: Meta<typeof VvAlert> = {
	title: 'Components/Alert/Slots',
	component: VvAlert,
	args: defaultArgs,
	argTypes,
}

export default meta

export const Default: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
		default: /*html*/ `
			Lorem ipsum dolor sit amet, consectetur adipiscing elit.
			<div class="mt-sm">Default <em class="italic">slot!</em></div>
		`,
	},
}

export const Header: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		header: 'Header <em class="italic">slot!</em>',
	},
}

export const TitleBefore: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
		'title::before': /*html*/ `
			<small class="text-smaller flex-1">10 minutes ago</small>
		`,
	},
}

export const TitleAfter: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
		'title::after': /*html*/ `
			<small class="text-smaller ml-auto">10 minutes ago</small>
		`,
	},
}

export const Footer: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
		role: 'alertdialog',
		footer: /*html*/ `
			<div class="vv-button-group" role="group">
				<button type="button" class="vv-button vv-button--action" id="c1RmyuK7IURatQsTHcP42">
					<span class="vv-button__label">Save</span>
				</button>
				<button type="button" class="vv-button vv-button--action-quiet" id="i2YcewpfM6ZKrhx1dHDe5">
					<span class="vv-button__label">Cancel</span>
				</button>
			</div>
		`,
	},
}
