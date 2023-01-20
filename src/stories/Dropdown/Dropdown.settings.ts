import { VvDropdownProps } from '@/components/VvDropdown'
import {
	ModifiersArgTypes,
	OptionsArgTypes,
	UnselectableArgTypes,
} from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvDropdownProps),
	name: 'vv-dropdown',
	disabled: false,
	valueObject: false,
	multiple: false,
	labelKey: 'label',
	valueKey: 'value',
	options: [
		{
			label: 'Option 1',
			value: 1,
		},
		{
			label: 'Option 2',
			value: 2,
		},
		{
			label: 'Option 3',
			value: 3,
		},
	],
}

export const argTypes = {
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['place-top'],
	},
	...OptionsArgTypes,
	labelNoResults: {
		control: { type: 'text' },
		table: {
			defaultValue: {
				summary: 'No results',
			},
		},
	},
	maxValues: {
		control: { type: 'number' },
	},
	...UnselectableArgTypes,
}
