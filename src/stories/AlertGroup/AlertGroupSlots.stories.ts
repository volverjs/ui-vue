import type { Meta } from '@storybook/vue3'
import VvAlert from '@/components/VvAlert/VvAlert.vue'
import { defaultArgs, argTypes } from './AlertGroup.settings'
import { Default as DefaultStory, type Story } from './AlertGroup.stories'

const meta: Meta<typeof VvAlert> = {
	title: 'Components/AlertGroup/Slots',
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
		default: /* html */ `
			<div class="vv-alert vv-alert--success" role="alert" aria-labelledby="Els38gSOH_Op3SFpzekW--title" style="--alert-duration:0ms;">
				<div class="vv-alert__header">
					<strong id="Els38gSOH_Op3SFpzekW--title" class="vv-alert__title">Success!</strong>
				</div>
				<div class="vv-alert__content">This is an success message.</div>
			</div>
			<div class="vv-alert vv-alert--accent mt-xs" role="alert" aria-labelledby="nkas44ZTfhbt5OEJYL06N-title" style="--alert-duration:0ms;">
				<div class="vv-alert__header">
					<strong id="nkas44ZTfhbt5OEJYL06N-title" class="vv-alert__title">Accent!</strong>
				</div>
				<div class="vv-alert__content">This is an accent message.</div>
			</div>
		`,
	},
}

export const Before: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
		before: /* html */ `
			<div class="flex justify-center">
				<button type="button" class="vv-button vv-button--action-quiet" id="y_Cl2wtJ8JJpDo-t6za2i">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="vv-icon vv-button__icon iconify iconify--normal iconify--vv" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M6 18 18 6M6 6l12 12"></path></svg>
					<span class="vv-button__label">Clear All</span>
				</button>
			</div>
		`,
	},
}

export const After: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
		after: /* html */ `
			<div class="flex justify-center">
				<button type="button" class="vv-button vv-button--action-quiet" id="y_Cl2wtJ8JJpDo-t6za2i">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="vv-icon vv-button__icon iconify iconify--normal iconify--vv" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M6 18 18 6M6 6l12 12"></path></svg>
					<span class="vv-button__label">Clear All</span>
				</button>
			</div>
		`,
	},
}
