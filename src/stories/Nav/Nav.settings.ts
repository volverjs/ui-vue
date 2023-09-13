import type { Meta } from '@storybook/vue3'
import type { VvNav } from '@/components'
import { VvNavProps } from '@/components/VvNav'
import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs: Meta<typeof VvNav>['args'] = {
	...propsToObject(VvNavProps),
	items: [
		{
			label: 'Item 1',
			href: 'javascript:void(0)',
		},
		{
			label: 'Item 2',
			to: 'about',
		},
		{
			label: 'Item 3',
			on: {
				click: () => {
					// eslint-disable-next-line no-console
					console.log('clicked Item 3')
				},
			},
		},
	],
	modifiers: 'sidebar',
}

export const argTypes = {
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['sidebar', 'aside', 'tabs', 'full'],
	},
}
