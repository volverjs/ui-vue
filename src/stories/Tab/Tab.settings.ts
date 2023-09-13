import type { Meta } from '@storybook/vue3'
import type { VvTab } from '@/components'
import { VvTabProps } from '@/components/VvTab'

export const defaultArgs: Meta<typeof VvTab>['args'] = {
	...propsToObject(VvTabProps),
	items: [
		{
			tab: 'tab-1',
			label: 'Item 1',
		},
		{
			tab: 'tab-2',
			label: 'Item 2',
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
