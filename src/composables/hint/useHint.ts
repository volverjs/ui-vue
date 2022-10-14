import { computed, toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

function joinErrors(errors: Array<any> | String): String {
	if (Array.isArray(errors))
		return errors
			.filter((e) => ObjectUtilities.isString(e))
			.reduce((prevVal: string, currVal: string) => {
				if (prevVal.length > 0) return prevVal + '\n' + currVal
				return currVal
			}, '')
	else return errors
}

export function useHint(props: any, context: any) {
	const { slots } = context

	const { hintLabel, error, errors } = toRefs(props)

	const hasHintLabel = computed(() => {
		return (
			(hintLabel && hintLabel.value) ||
			slots.hint ||
			hasErrorsToShow.value
		)
	})

	const hasErrorsToShow = computed(() => {
		if (!error || error?.value !== true) return false
		if (!errors) return false

		if (Array.isArray(errors.value)) return errors.value.length > 0
		else return ObjectUtilities.isNotEmpty(errors.value)
	})

	const currentHintLabel = computed(() => {
		if (error && error.value === true && hasErrorsToShow.value)
			return joinErrors(errors.value)

		return hintLabel.value
	})

	return {
		hasHintLabel,
		hasErrorsToShow,
		currentHintLabel
	}
}
