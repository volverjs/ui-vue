import { Side } from '@/constants'
import { ModifiersProps } from '@/props'
import type { PropType } from 'vue'

export const VvTooltipProps = {
	...ModifiersProps,
	/**
	 * Define the tooltip position
	 * @default Side.bottom
	 */
	position: {
		type: String as PropType<Side>,
		default: Side.bottom,
	},
	value: {
		type: String,
	},
}
