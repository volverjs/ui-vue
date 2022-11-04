import { h, type Component, type ExtractPropTypes, type Slots } from 'vue'
import { computed, toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Merge errors from Array<string> to string errors separated from new line (\n)
 * @param {Array<string> | string} errors
 * @returns {string}
 */
function joinErrors(errors: Array<string> | string) {
	if (Array.isArray(errors))
		return errors
			.filter((e) => ObjectUtilities.isString(e))
			.reduce((prevVal, currVal) => {
				if (prevVal.length > 0) return prevVal + '\n' + currVal
				return currVal
			}, '')
	else return errors
}

interface HintSlotProps {
	hintLabel: {
		type: StringConstructor
		default: ''
		required: true
	}
	modelValue: null
	valid: BooleanConstructor
	validLabel: (StringConstructor | ArrayConstructor)[]
	error: BooleanConstructor
	errorLabel: (StringConstructor | ArrayConstructor)[]
}

interface HintSlotPropsWithLoading extends HintSlotProps {
	loading: BooleanConstructor
	loadingLabel: StringConstructor
}

/**
 * Return a vue component (HintSlot) to render and manage hint, errors, valid, loading state and messages
 * @param {Readonly<ExtractPropTypes<HintSlotProps | HintSlotPropsWithLoading>>} pProps vue props
 * @param {Slots} pSlots vue slots
 * @returns {Component} vue component
 */
export function HintSlotFactory(
	pProps: Readonly<
		ExtractPropTypes<HintSlotProps | HintSlotPropsWithLoading>
	>,
	pSlots: Slots
): Component {
	return {
		name: 'HintSlot',
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
				valid,
				validLabel,
				error,
				errorLabel
			} = props
			const loading = ObjectUtilities.resolveFieldData(props, 'loading')
			const loadingLabel = ObjectUtilities.resolveFieldData(
				props,
				'loadingLabel'
			)

			const hasErrors = computed(() => {
				//No error
				if (!error.value) return false

				if (error.value && errorSlot) return true

				if (
					errorLabel?.value &&
					Array.isArray(errorLabel.value) &&
					errorLabel.value.length > 0
				)
					return true

				if (
					errorLabel?.value &&
					ObjectUtilities.isNotEmpty(errorLabel.value)
				)
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
					(loading?.value && loadingLabel?.value)
				)
			})

			const errorMessage = computed(() => {
				if (Array.isArray(errorLabel?.value))
					return joinErrors(errorLabel?.value || '')
				else return errorLabel?.value
			})

			const hintContent = computed(() => {
				const slotProps = { modelValue, error, valid }

				if (error?.value) {
					return (
						errorSlot?.(slotProps) ||
						errorMessage?.value ||
						hintLabel?.value
					)
				}

				if (valid?.value)
					return (
						validSlot?.(slotProps) ||
						validLabel?.value ||
						hintLabel?.value
					)

				if (loading?.value)
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
				return h('span', null, this.hintContent)
			}
		}
	}
}

export default HintSlotFactory
