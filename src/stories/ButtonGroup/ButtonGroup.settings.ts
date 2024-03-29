import {
	DefaultSlotArgTypes,
	ModifiersArgTypes,
	UnselectableArgTypes,
} from '@/stories/argTypes'
import { VvButtonGroupProps } from '@/components/VvButtonGroup'
import { argTypes as buttonArgTypes } from '../Button/Button.settings'

export const defaultArgs = {
	...propsToObject(VvButtonGroupProps),
	modifiers: [],
}

export const argTypes = {
	modelValue: {
		table: {
			disable: true,
		},
	},
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['compact', 'vertical', 'block'],
	},
	itemModifiers: {
		options: buttonArgTypes.modifiers.options,
		control: {
			type: 'check',
		},
	},
	...UnselectableArgTypes,
	...DefaultSlotArgTypes,
}
