import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { Default } from './InputText.stories'
import { defaultArgs, argTypes } from './InputText.settings'

const meta: Meta<typeof VvInputText> = {
	title: 'Components/InputText/Mask',
	component: VvInputText,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const RegExp: Story = {
	...Default,
	args: {
		...defaultArgs,
		id: 'regexp',
		iMask: {
			mask: /^\d+$/,
		},
	},
}

export const PhoneNumber: Story = {
	...Default,
	args: {
		...defaultArgs,
		id: 'phone-number',
		iMask: {
			mask: '+{39}(000)000-00-00',
		},
	},
}

export const Pattern: Story = {
	...Default,
	args: {
		...defaultArgs,
		id: 'pattern',
		iMask: {
			mask: 'XXX-XX-00000',
			definitions: {
				X: {
					mask: '0',
					displayChar: 'X',
					placeholderChar: '#',
				},
			},
			lazy: false,
			overwrite: 'shift',
		},
	},
}

export const IntlNumber: Story = {
	...Default,
	args: {
		...defaultArgs,
		id: 'intl-number',
		type: 'number',
		iMask: {
			mask: Number,
			thousandsSeparator: '.',
			radix: ',',
		},
	},
}

export const DatePlaceholder: Story = {
	...Default,
	args: {
		...defaultArgs,
		id: 'date-placeholder',
		type: 'date',
		iMask: {
			mask: Date,
			pattern: 'd.m.Y',
			lazy: false,
		},
	},
}

export const PhoneOrEmail: Story = {
	...Default,
	args: {
		...defaultArgs,
		id: 'phone-or-email',
		iMask: {
			mask: [
				{
					mask: '+{39}(000)000-00-00',
				},
				{
					mask: /^\S*@?\S*$/,
				},
			],
		},
	},
}

export const Currency: Story = {
	...Default,
	args: {
		...defaultArgs,
		id: 'currency',
		type: 'number',
		iMask: {
			mask: '€ num',
			blocks: {
				num: {
					mask: Number,
					thousandsSeparator: '.',
					radix: ',',
				},
			},
		},
	},
}
