import { HintArgTypes, ModifiersArgTypes } from '@/stories/argTypes'
import { VvInputFileProps } from '@/components/VvInputFile'

export const defaultArgs = {
	...propsToObject(VvInputFileProps),
	name: 'vv-input-file',
	label: 'Upload file',
}

export const argTypes = {
	...HintArgTypes,
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['drop-area', 'hidden', 'square', 'circle'],
	},
}
