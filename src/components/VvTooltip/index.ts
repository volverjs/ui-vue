import { ModifiersProps } from '@/props'
import type { PropType } from 'vue'

export enum TooltipPosition {
	left = 'left',
	right = 'right',
	top = 'top',
	bottom = 'bottom'
}

export const VvTooltipProps = {
	...ModifiersProps,
	/**
	 * Define the tooltip position
	 * @default TooltipPosition.bottom
	 */
	position: {
		type: String as PropType<TooltipPosition>,
		default: TooltipPosition.bottom
	}
}
