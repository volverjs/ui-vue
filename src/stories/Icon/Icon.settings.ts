import { VvIconProps } from '@/components/VvIcon'
import normal from '@/assets/icons/normal.json'
import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvIconProps),
	name: 'add-circle',
}

export const argTypes = {
	name: {
		options: Object.keys(normal.icons),
		control: {
			type: 'select',
		},
	},
	mode: {
		options: ['style', 'bg', 'mask', 'svg'],
		control: {
			type: 'select',
		},
	},
	src: {
		description: 'Url remote SVG icon',
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'url',
			},
		},
	},
	svg: {
		description: 'Svg icon string',
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'xml',
			},
		},
	},
	prefix: {
		options: ['simple', 'normal', 'detailed'],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: {
				summary: 'normal',
			},
		},
	},
	flip: {
		options: ['', 'vertical', 'horizontal'],
		control: {
			type: 'radio',
		},
	},
	onLoad: {
		description: 'A callback that is called when icon data has been loaded',
		table: {
			type: {
				summary: 'function',
			},
		},
	},
	...ModifiersArgTypes,
}
