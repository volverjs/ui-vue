import { VvTabProps } from '@/components/VvTab'

export const defaultArgs = {
	...propsToObject(VvTabProps),
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
			id: 'tab-3',
			title: 'Item 3',
			to: 'contacts',
			on: {
				click: () => {
					// eslint-disable-next-line no-console
					console.log('clicked Item 3')
				},
			},
		},
	],
}

export const defaultArgTypes = {
	tabId: {
		description: 'Slot by tab-id',
		control: {
			type: 'text',
		},
		table: {
			category: 'Slots',
			type: {
				summary: 'html',
			},
		},
	},
}
