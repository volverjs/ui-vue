import type { NavItem } from '../../types'
import { ModifiersProps } from '../../props'

export const VvBreadcrumbProps = {
    ...ModifiersProps,
    routes: Array as PropType<NavItem[]>,
}
