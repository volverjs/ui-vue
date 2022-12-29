import { ModifiersProps } from '@/props'

export const VvProgressProps = {
	...ModifiersProps,
	/**
	 * Progress value
	 */
	value: {
		type: [Number, String],
		default: undefined
	},
	/**
	 * Progress max value
	 */
	max: {
		type: [Number, String]
	},
	/**
	 * Progress label
	 */
	ariaLabel: {
		type: String,
		default: 'progress-bar'
	}
}
