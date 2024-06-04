import {
	DefaultSlotArgTypes,
	ModifiersArgTypes,
	UnselectableArgTypes,
} from '@/stories/argTypes'
import { VvButtonGroupProps } from '@/components/VvButtonGroup'
import { argTypes as buttonArgTypes } from '../Button/Button.settings'
import type { ArgTypes } from '@storybook/vue3'

export const defaultArgs = {
	...propsToObject(VvButtonGroupProps),
	modifiers: [],
}

// @ts-ignore
export const argTypes: ArgTypes = {
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
	legend: {
		control: {
			type: 'text',
			table: {
				category: 'Slots',
			},
		},
	},
	...UnselectableArgTypes,
	...DefaultSlotArgTypes,
}
