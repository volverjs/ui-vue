import { VvTooltipProps } from '@/components/VvTooltip'
import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'
import type { ArgTypes } from '@storybook/types'

export const defaultArgs = {
	...propsToObject(VvTooltipProps),
	value: "I'm a tooltip",
}

// @ts-ignore
export const argTypes: ArgTypes = {
	...ModifiersArgTypes,
	...DefaultSlotArgTypes,
	position: {
		type: 'string',
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: 'bottom' },
		},
		description: 'Indicates where to place the tooltip',
		options: [undefined, 'left', 'right', 'bottom', 'top'],
	},
}
