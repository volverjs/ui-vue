import { computed, provide, ref, toRefs } from 'vue'
import { useValidationState } from '../validation/useValidationState'
import ObjectUtilities from '../../utils/ObjectUtilities'

export function useHint(props: any, context: any) {
	const { slots } = context
	const { hintLabel } = toRefs(props)
	const { error, errors, hasErrors, errorMessage } = useValidationState(
		props,
		context
	)

	const hasHintLabel = computed(() => {
		return (hintLabel && hintLabel.value) || slots.hint || hasErrors.value
	})

	const currentHintLabel = computed(() => {
		if (error && error.value === true && hasErrors.value)
			return errorMessage.value

		return hintLabel.value
	})

	return {
		hasHintLabel,
		currentHintLabel
	}
}

export function useHintSlot(props: any, context: any) {
	//Slots
	const { slots } = context
	const { error: errorSlot, valid: validSlot, hint: hintSlot } = slots

	//Props hint + errors
	const { hintLabel, modelValue } = toRefs(props)
	const { isValid, isInvalid, hasErrors, errorMessage, validLabel } =
		useValidationState(props, context)

	const hasHint = computed(() => {
		return (
			(hintLabel && hintLabel.value) ||
			hintSlot ||
			validSlot ||
			hasErrors.value
		)
	})

	provide(
		'HINT_CONTENT',
		computed(() => {
			let slotProps = { modelValue, isValid, isInvalid }

			if (isInvalid.value) {
				return errorSlot ? errorSlot(slotProps) : errorMessage.value
			}

			if (isValid.value)
				return validSlot ? validSlot(slotProps) : validLabel.value

			return hintSlot ? hintSlot(slotProps) : hintLabel.value
		})
	)

	return {
		hasHint,
		isValid,
		isInvalid
	}
}
