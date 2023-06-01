import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	max: undefined,
	value: undefined,
	label: 'Progress bar',
}
export const argTypes = {
	...ModifiersArgTypes,
	max: {
		description:
			'This attribute describes how much work the task indicated by the progress element requires. The max attribute, if present, must have a value greater than 0 and be a valid floating point number. The default value is 1.',
		control: {
			type: 'text',
		},
	},
	value: {
		description:
			'This attribute specifies how much of the task that has been completed. It must be a valid floating point number between 0 and max, or between 0 and 1 if max is omitted. If there is no value attribute, the progress bar is indeterminate.',
		control: {
			type: 'text',
		},
	},
	label: {
		description: 'Progress aria-label',
		control: {
			type: 'text',
		},
	},
}
