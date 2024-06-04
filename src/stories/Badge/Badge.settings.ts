import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'
import type { ArgTypes } from '@storybook/vue3'

export const defaultArgs = {
	modifiers: [],
}

export const argTypes: ArgTypes = {
	value: {
		control: { type: 'text' },
	},
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: [
			'danger',
			'success',
			'warning',
			'info',
			'accent',
			'rounded',
			'outline',
			'ghost',
			'sm',
		],
	},
	...DefaultSlotArgTypes,
}
