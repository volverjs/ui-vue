import { toRefs } from 'vue'
import type { Option } from '@/types/generic'

// eslint-disable-next-line
export function useOptions(props: any) {
	const { options, labelKey, valueKey } = toRefs(props)

	// eslint-disable-next-line
	const getOptionLabel = (option: string | Option) => {
		if (typeof option !== 'object' && option !== null) return option

		return typeof labelKey.value === 'function'
			? labelKey.value(option)
			: option[labelKey.value]
	}

	// eslint-disable-next-line
	const getOptionValue = (option: any) => {
		if (typeof option !== 'object' && option !== null) return option

		return typeof valueKey.value === 'function'
			? valueKey.value(option)
			: option[valueKey.value]
	}

	return {
		options,
		getOptionLabel,
		getOptionValue
	}
}
