import { VvTooltipProps } from '@/components/VvTooltip'
import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvTooltipProps),
    default: "I'm a tooltip"
}

export const argTypes = {
    ...ModifiersArgTypes,
    ...DefaultSlotArgTypes,
    position: {
        type: {
			summary: 'string',
		},
        control: {
            type: 'select',
        },
        table: {
			defaultValue: { summary: 'bottom' },
		},
        description: 'Indicates where to place the tooltip',
        options: [undefined, 'left', 'right', 'bottom', 'top']
    }
}