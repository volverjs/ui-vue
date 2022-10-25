import { h } from 'vue'
import { computed, toRefs } from 'vue'
import { useValidationState } from '../../composables/validation/useValidationState'
import ObjectUtilities from '../../utils/ObjectUtilities'

export const HintSlotFactory = (pProps, pSlots) => {
	return {
		setup() {
			const props = toRefs(pProps)

			//Slots
			// const { slots } = context
			const {
				error: errorSlot,
				valid: validSlot,
				hint: hintSlot,
				loading: loadingSlot
			} = pSlots

			//Props hint + errors
			const { hintLabel, modelValue, loading, loadingLabel } = props
			const { isValid, isInvalid, hasErrors, errorMessage, validLabel } =
				useValidationState(pProps, { slots: pSlots })

			const hasHint = computed(() => {
				return !!(
					(hintLabel && hintLabel.value) ||
					hintSlot ||
					validSlot ||
					(validLabel && validLabel.value) ||
					hasErrors.value ||
					(loading?.value && loadingSlot) ||
					(loading?.value && loadingLabel.value)
				)
			})

			const isLoading = computed(() => loading?.value)

			const hintContent = computed(() => {
				const slotProps = { modelValue, isValid, isInvalid }

				if (isInvalid.value) {
					return (
						errorSlot?.(slotProps) ||
						errorMessage?.value ||
						hintLabel?.value
					)
				}

				if (isValid.value)
					return (
						validSlot?.(slotProps) ||
						validLabel?.value ||
						hintLabel?.value
					)

				if (isLoading.value)
					return (
						loadingSlot?.(slotProps) ||
						loadingLabel?.value ||
						hintLabel?.value
					)

				return (
					hintSlot?.(slotProps) ||
					hintLabel?.value ||
					hintLabel?.value
				)
			})

			return {
				hasHint,
				isValid,
				isInvalid,
				isLoading,
				hintContent
			}
		},
		render() {
			if (this.hasHint) {
				return h(
					'span',
					{
						style: {
							'white-space': 'pre'
						}
					},
					this.hintContent
				)
			}
		}
	}
}

export default HintSlotFactory
