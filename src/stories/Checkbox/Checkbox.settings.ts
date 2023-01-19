import { CheckboxRadioArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	name: 'checkbox',
	label: 'Option',
	value: 'my-value',
	tabindex: 0,
	disabled: false,
	switch: false,
	readonly: false,
	invalid: false,
	valid: false,
	indeterminate: false,
	uncheckedValue: undefined,
}

export const argTypes = {
	...CheckboxRadioArgTypes,
	indeterminate: {
		type: 'boolean',
		description: 'If true, the input will be indeterminated',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	uncheckedValue: {
		description: 'Value associated with the unchecked state.',
		control: {
			type: 'text',
		},
	},
	switch: {
		type: 'boolean',
		description: 'If true, the input will be displayed as a switch.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
}
