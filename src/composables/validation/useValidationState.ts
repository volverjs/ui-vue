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

export function useValidationState(props: any, context: any) {
	const { slots } = context
	const { valid, validLabel, error, errors } = toRefs(props)

	const isValid = computed(() => {
		return valid?.value === true
	})

	const isInvalid = computed(() => {
		return error?.value === true
	})

	const hasErrors = computed(() => {
		//No error
		if (!error || error?.value !== true) return false

		//Error true
		if (slots.error) return true

		if (errors && Array.isArray(errors.value) && errors.value.length > 0)
			return true

		if (errors && ObjectUtilities.isNotEmpty(errors.value)) return true

		return false
	})

	const errorMessage = computed(() => {
		if (Array.isArray(errors.value)) return joinErrors(errors.value)
		else return errors.value
	})

	return {
		valid,
		error,
		errors,
		hasErrors,
		isInvalid,
		isValid,
		errorMessage,
		validLabel
	}
}