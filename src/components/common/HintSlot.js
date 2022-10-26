import { h } from 'vue'
import { computed, toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

function joinErrors(errors) {
	if (Array.isArray(errors))
		return errors
			.filter((e) => ObjectUtilities.isString(e))
			.reduce((prevVal, currVal) => {
				if (prevVal.length > 0) return prevVal + '\n' + currVal
				return currVal
			}, '')
	else return errors
}

export const HintSlotFactory = (pProps, pSlots) => {
	return {
		setup() {
			const props = toRefs(pProps)

			//Slots
			const {
				error: errorSlot,
				valid: validSlot,
				hint: hintSlot,
				loading: loadingSlot
			} = pSlots

			//Props hint + errors
			const {
				hintLabel,
				modelValue,
				loading,
				loadingLabel,
				valid,
				validLabel,
				error,
				errors
			} = props

			const hasErrors = computed(() => {
				//No error
				if (!error.value || error?.value === false) return false

				if (error.value && errorSlot) return true

				if (
					errors.value &&
					Array.isArray(errors.value) &&
					errors.value.length > 0
				)
					return true

				if (errors.value && ObjectUtilities.isNotEmpty(errors.value))
					return true

				return false
			})

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

			const errorMessage = computed(() => {
				if (Array.isArray(errors.value)) return joinErrors(errors.value)
				else return errors.value
			})

			const hintContent = computed(() => {
				const slotProps = { modelValue, error, valid }

				if (error.value) {
					return (
						errorSlot?.(slotProps) ||
						errorMessage?.value ||
						hintLabel?.value
					)
				}

				if (valid.value)
					return (
						validSlot?.(slotProps) ||
						validLabel?.value ||
						hintLabel?.value
					)

				if (loading.value)
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
