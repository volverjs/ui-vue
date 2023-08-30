import type { Option } from '../types/generic'
import { get } from 'ts-dot-prop'

// eslint-disable-next-line
export function useOptions(props: any) {
	const { options, labelKey, valueKey, disabledKey } = toRefs(props)

	// eslint-disable-next-line
	const getOptionLabel = (option: string | Option): string => {
		if (typeof option !== 'object' && option !== null) return option

		return String(
			typeof labelKey.value === 'function'
				? labelKey.value(option)
				: get(option, labelKey.value),
		)
	}

	const getOptionValue = (option: string | Option) => {
		if (typeof option !== 'object' && option !== null) return option

		return typeof valueKey.value === 'function'
			? valueKey.value(option)
			: get(option, valueKey.value)
	}

	const isOptionDisabled = (option: string | Option): boolean => {
		if (typeof option !== 'object' && option !== null) return false

		return typeof disabledKey.value === 'function'
			? disabledKey.value(option)
			: get(option, disabledKey.value)
	}

	const getOptionGrouped = (option: string | Option) => {
		if (typeof option !== 'object' && option !== null) return []
		return option.options || []
	}

	return {
		options,
		getOptionLabel,
		getOptionValue,
		isOptionDisabled,
		getOptionGrouped,
	}
}
