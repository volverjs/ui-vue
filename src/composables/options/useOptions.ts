import { toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

export function useOptions(props: any, context: any) {
	const { options, optionLabel, optionValue } = toRefs(props)

	const getOptionLabel = (o: any) => {
		if (typeof o !== 'object' && o !== null) return o

		return typeof optionLabel.value === 'function'
			? optionLabel.value(o)
			: o[optionLabel.value]
	}

	const getOptionValue = (o: any) => {
		if (typeof o !== 'object' && o !== null) return o

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