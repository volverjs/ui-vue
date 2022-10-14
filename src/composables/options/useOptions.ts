import { toRefs, computed } from 'vue'

export function useOptions(props: any, context: any) {
	const { options, optionLabel, optionValue } = toRefs(props)

	const getOptionLabel = (o: any) => {
		return typeof optionLabel.value === 'function'
			? optionLabel.value(o)
			: o[optionLabel.value]
	}

	const getOptionValue = (o: any) => {
		return typeof optionValue.value === 'function'
			? optionValue.value(o)
			: o[optionValue.value]
	}

	return {
		options,
		getOptionLabel,
		getOptionValue
	}
}
