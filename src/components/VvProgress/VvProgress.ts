export const VvProgressProps = {
	/**
	 * Progress value
	 */
	value: {
		type: Number
	},
	/**
	 * Progress max value
	 */
	max: {
		type: Number
	},
	/**
	 * Progress label
	 */
	ariaLabel: {
		type: String,
		default: 'progress-bar'
	},
	/**
	 * Indeterminate attribute
	 */
	indeterminate: Boolean
}
