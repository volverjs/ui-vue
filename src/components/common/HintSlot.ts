import {
	type Component,
	type ExtractPropTypes,
	type Slots,
	type Ref,
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
	if (Array.isArray(errors)) {
		return errors.filter((e) => isString(e)).join(' ')
	}
	return errors
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
 * @param {Readonly<ExtractPropTypes<HintSlotProps | HintSlotPropsWithLoading>>} parentProps vue props
 * @param {Slots} parentSlots vue slots
 * @returns {Component} vue component
 */
export function HintSlotFactory(
	parentProps: Readonly<
		ExtractPropTypes<HintSlotProps | HintSlotPropsWithLoading>
	>,
	parentSlots: Slots
): Component {
	return {
		name: 'HintSlot',
		props: {
			params: {
				type: Object,
				default: () => ({})
			}
		},
		setup(props) {
			// slots
			const {
				error: errorSlot,
				valid: validSlot,
				hint: hintSlot,
				loading: loadingSlot
			} = parentSlots

			// props
			const {
				hintLabel,
				modelValue,
				valid,
				validLabel,
				error,
				errorLabel,
				...otherProps
			} = toRefs(parentProps)
			const loading = resolveFieldData(otherProps, 'loading') as
				| Ref<boolean>
				| undefined
			const loadingLabel = resolveFieldData(
				otherProps,
				'loadingLabel'
			) as Ref<string> | undefined

			const hasErrors = computed(() => {
				if (!error.value) {
					return false
				}
				if (error.value && errorSlot) {
					return true
				}
				if (
					errorLabel?.value &&
					Array.isArray(errorLabel.value) &&
					errorLabel.value.length > 0
				) {
					return true
				}
				if (errorLabel?.value && !isEmpty(errorLabel)) {
					return true
				}
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
					...props.params
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
				return h('small', this.hintContent)
			}
		}
	}
}

export default HintSlotFactory
