import { VvNavProps } from '@/components/VvNav'
import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvNavProps),
	items: [
		{
			title: 'Title 1',
			items: [
				{
					title: 'Item 1',
					href: 'javascript:void(0)',
				},
				{
					title: 'Item 2',
					to: 'about',
				},
				{
					title: 'Item 3',
					to: 'contacts',
					on: {
						click: () => {
							console.log('clicked Item 3')
						},
					},
				},
			],
		},
		{
			items: [
				{
					title: 'Item 4',
					href: 'javascript:void(0)',
				},
				{
					title: 'Item 5',
					to: 'about',
				},
				{
					title: 'Item 6',
					to: 'contacts',
					on: {
						click: () => {
							console.log('clicked Item 3')
						},
					},
				},
			],
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
