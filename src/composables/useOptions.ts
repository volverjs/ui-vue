import type { Option } from '../types/generic'

// eslint-disable-next-line
export function useOptions(props: any) {
	const { options, labelKey, valueKey, disabledKey } = toRefs(props)

	// eslint-disable-next-line
	const getOptionLabel = (option: string | Option) => {
		if (typeof option !== 'object' && option !== null) return option

		return typeof labelKey.value === 'function'
			? labelKey.value(option)
			: option[labelKey.value]
	}

	const getOptionValue = (option: string | Option) => {
		if (typeof option !== 'object' && option !== null) return option

		return typeof valueKey.value === 'function'
			? valueKey.value(option)
			: option[valueKey.value]
	}

	const getOptionDisabled = (option: string | Option) => {
		if (typeof option !== 'object' && option !== null) return false

		return typeof disabledKey.value === 'function'
			? disabledKey.value(option)
			: option[disabledKey.value]
	}

	const getOptionGrouped = (option: string | Option) => {
	if (typeof option !== 'object' && option !== null) return []
		return option.options
	}

	return {
		options,
		getOptionLabel,
		getOptionValue,
		getOptionDisabled,
		getOptionGrouped
	}
}
