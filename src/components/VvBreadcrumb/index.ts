import { ModifiersProps } from '../../props'
import type { NavItem } from '../../types'

export const VvBreadcrumbProps = {
	...ModifiersProps,
	routes: Array as PropType<NavItem[]>,
}
