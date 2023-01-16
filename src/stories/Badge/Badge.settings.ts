import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	modifiers: []
}

export const argTypes = {
	value: {
		control: { type: 'text' }
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
			'sm'
		]
	},
	...DefaultSlotArgTypes
}
