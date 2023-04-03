import type { Component, ExtractPropTypes, Slots, Ref } from 'vue'

/**
 * Merge errors from string[] to string errors separated from new line (\n)
 * @param {string[] | string} errors
 * @returns {string}
 */
function joinLines(errors: string[] | string | unknown[] | undefined) {
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
	invalid: BooleanConstructor
	invalidLabel: (StringConstructor | ArrayConstructor)[]
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
	parentSlots: Slots,
): {
	HintSlot: Component
	hasHint: Ref<boolean>
	hasInvalid: Ref<boolean>
	hasValid: Ref<boolean>
	hasLoading: Ref<boolean>
} {
	// slots
	const {
		invalid: invalidSlot,
		valid: validSlot,
		hint: hintSlot,
		loading: loadingSlot,
	} = parentSlots

	// props
	const {
		hintLabel,
		modelValue,
		valid,
		validLabel,
		invalid,
		invalidLabel,
		...otherProps
	} = toRefs(parentProps)

	const loading = resolveFieldData(otherProps, 'loading') as
		| Ref<boolean>
		| undefined
	const loadingLabel = resolveFieldData(otherProps, 'loadingLabel') as
		| Ref<string>
		| undefined

	const hasInvalid = computed(() => {
		if (!invalid.value) {
			return false
		}
		if (invalid.value && invalidSlot) {
			return true
		}
		if (
			invalidLabel?.value &&
			Array.isArray(invalidLabel.value) &&
			invalidLabel.value.length > 0
		) {
			return true
		}
		if (invalidLabel?.value && !isEmpty(invalidLabel)) {
			return true
		}
		return false
	})

	const hasHint = computed(
		() => !!((hintLabel && hintLabel.value) || hintSlot),
	)

	const hasValid = computed(
		() => !!((validLabel && validLabel.value) || validSlot),
	)

	const hasLoading = computed(
		() =>
			!!(
				(loading?.value && loadingSlot) ||
				(loading?.value && loadingLabel?.value)
			),
	)

	const isVisible = computed(
		() =>
			hasHint.value ||
			hasValid.value ||
			hasInvalid.value ||
			hasLoading.value,
	)

	return {
		hasInvalid,
		hasHint,
		hasValid,
		hasLoading,
		HintSlot: {
			name: 'HintSlot',
			props: {
				params: {
					type: Object,
					default: () => ({}),
				},
			},
			setup(props) {
				const hintContent = computed(() => {
					const slotProps = toReactive({
						hintLabel,
						modelValue,
						valid,
						validLabel,
						invalid,
						invalidLabel,
						loading,
						loadingLabel,
						...props.params,
					})

					if (invalid?.value) {
						return (
							invalidSlot?.(slotProps) ||
							joinLines(invalidLabel?.value) ||
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
					isVisible,
					hasInvalid,
					hasValid,
					hintContent,
				}
			},
			render() {
				if (this.isVisible) {
					return h(
						'small',
						{
							role: this.hasInvalid
								? 'alert'
								: this.hasValid
								? 'status'
								: undefined,
						},
						this.hintContent,
					)
				}
			},
		},
	}
}

export default HintSlotFactory
