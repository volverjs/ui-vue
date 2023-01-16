import { VvBreadcrumbProps } from '@/components/VvBreadcrumb'
import { propsToObject } from '@/utils/ObjectUtilities'

export const defaultArgs = {
	...propsToObject(VvBreadcrumbProps),
	routes: [
		{
			label: 'Home',
			title: 'Home',
			href: '/home'
		},
		{
			label: 'Library',
			title: 'Library',
			href: '/library'
		},
		{
			label: 'Book 1',
			title: 'Book 1'
		}
	]
}

export const argTypes = {
	modifiers: {
		control: 'check',
		options: ['multiline']
	},
	label: {
		description: 'The label slot',
		control: {
			type: 'text'
		},
		table: {
			category: 'Slots',
			type: {
				summary: 'html'
			}
		}
	}
}
