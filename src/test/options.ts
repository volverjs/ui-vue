// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOptionValue = (args: any, index: number) => {
	if (args.options && args.options.length > index) {
		let value = args.options[index]
		if (args.valueKey) {
			if (typeof args.valueKey === 'function') {
				value = args.valueKey(value)
			} else if (typeof value === 'object') {
				value = value[args.valueKey]
			}
		} else if (typeof value === 'object') {
			value = value.value
		}
		return value
	}
	return undefined
}
