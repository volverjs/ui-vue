import {
	type Component,
	type ExtractPropTypes,
	type Slots,
	computed,
	toRefs,
	h
} from 'vue'
import { toReactive } from '@vueuse/core'
import { isString, resolveFieldData, isEmpty } from '@/utils/ObjectUtilities'

/**
 * Merge errors from Array<string> to string errors separated from new line (\n)
 * @param {Array<string> | string} errors
 * @returns {string}
 */
function joinLines(errors: Array<string> | string | unknown[] | undefined) {
	if (Array.isArray(errors))
		return errors
			.filter((e) => isString(e))
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
		props: {
			params: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		setup(hProps) {
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
			const loading = resolveFieldData(props, 'loading')
			const loadingLabel = resolveFieldData(props, 'loadingLabel')

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

				if (errorLabel?.value && !isEmpty(errorLabel)) return true

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

			// const errorMessage = computed(() => {
			// 	if (Array.isArray(errorLabel?.value))
			// 		return joinLines(errorLabel?.value || '')
			// 	else return errorLabel?.value
			// })

			const hintContent = computed(() => {
				const slotProps = toReactive({
					hintLabel,
					modelValue,
					valid,
					validLabel,
					error,
					errorLabel,
					loading,
					loadingLabel,
					...hProps.params
				})

				if (error?.value) {
					return (
						errorSlot?.(slotProps) ||
						joinLines(errorLabel?.value) ||
						hintLabel?.value
					)
				}

				if (valid?.value)
					return (
						validSlot?.(slotProps) ||
						joinLines(validLabel?.value) ||
						hintLabel?.value
					)

				if (loading?.value)
					return (
						loadingSlot?.(slotProps) ||
						joinLines(loadingLabel?.value) ||
						hintLabel?.value
					)

				return (
					hintSlot?.(slotProps) ||
					joinLines(hintLabel?.value) ||
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
					'pre',
					{ style: { 'white-space': 'pre' } },
					this.hintContent
				)
			}
		}
	}
}

export default HintSlotFactory
