import { ModifiersProps } from '../../props'

export interface Route {
	label: string
	to?: string | { [key: string]: any }
	title?: string
	href?: string
}

export const VvBreadcrumbProps = {
	...ModifiersProps,
	routes: Array<Route>,
	multiline: Boolean
}