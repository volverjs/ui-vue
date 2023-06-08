import type { ExtractPropTypes, Slots } from 'vue'
import type { Ref } from 'vue'

/**
 * Merge array of string
 * @param {string[] | string} items
 * @returns {string}
 */
function joinLines(items: string[] | string | unknown[] | undefined) {
	if (Array.isArray(items)) {
		return items.filter((item) => isString(item)).join(' ')
	}
	return items
}

export type HintSlotProps = Readonly<
	ExtractPropTypes<{
		hintLabel: {
			type: StringConstructor
			default: ''
			required: true
		}
		modelValue: unknown
		valid: BooleanConstructor
		validLabel: (StringConstructor | ArrayConstructor)[]
		invalid: BooleanConstructor
		invalidLabel: (StringConstructor | ArrayConstructor)[]
		loading: BooleanConstructor
		loadingLabel: StringConstructor
	}>
>

/**
 * Return a vue component (HintSlot) to render and manage hint, errors, valid, loading state and messages
 * @param {HintSlotProps} parentProps vue props
 * @param {Slots} parentSlots vue slots
 * @returns {Component} vue component
 */
export function HintSlotFactory(
	propsOrRef: HintSlotProps | Ref<HintSlotProps>,
	slots: Slots,
) {
	const props = unref(propsOrRef)
	// label
	const invalidLabel = computed(() => joinLines(props.invalidLabel))
	const validLabel = computed(() => joinLines(props.validLabel))
	const loadingLabel = computed(() => props.loadingLabel)
	const hintLabel = computed(() => props.hintLabel)

	// type
	const hasLoadingLabelOrSlot = computed(() =>
		Boolean(props.loading && (slots.loading || loadingLabel.value)),
	)
	const hasInvalidLabelOrSlot = computed(
		() =>
			!hasLoadingLabelOrSlot.value &&
			Boolean(props.invalid && (slots.invalid || invalidLabel.value)),
	)
	const hasValidLabelOrSlot = computed(
		() =>
			!hasLoadingLabelOrSlot.value &&
			!hasInvalidLabelOrSlot.value &&
			Boolean(props.valid && (slots.valid || validLabel.value)),
	)
	const hasHintLabelOrSlot = computed(
		() =>
			!hasLoadingLabelOrSlot.value &&
			!hasInvalidLabelOrSlot.value &&
			!hasValidLabelOrSlot.value &&
			Boolean(slots.hint || hintLabel.value),
	)
	const isVisible = computed(
		() =>
			hasInvalidLabelOrSlot.value ||
			hasValidLabelOrSlot.value ||
			hasLoadingLabelOrSlot.value ||
			hasHintLabelOrSlot.value,
	)
	const hintSlotScope = computed(() => ({
		modelValue: props.modelValue,
		valid: props.valid,
		invalid: props.invalid,
		loading: props.loading,
	}))
	// component
	const HintSlot = defineComponent({
		name: 'HintSlot',
		props: {
			tag: {
				type: String,
				default: 'small',
			},
		},
		setup() {
			return {
				isVisible,
				invalidLabel,
				validLabel,
				loadingLabel,
				hintLabel,
				hasInvalidLabelOrSlot,
				hasValidLabelOrSlot,
				hasLoadingLabelOrSlot,
				hasHintLabelOrSlot,
			}
		},
		render() {
			if (this.isVisible) {
				let role
				if (this.hasInvalidLabelOrSlot) {
					role = 'alert'
				}
				if (this.hasValidLabelOrSlot) {
					role = 'status'
				}
				if (this.hasLoadingLabelOrSlot) {
					return h(
						this.tag,
						{
							role,
						},
						this.$slots.loading?.() ?? this.loadingLabel,
					)
				}
				if (this.hasInvalidLabelOrSlot) {
					return h(
						this.tag,
						{
							role,
						},
						this.$slots.invalid?.() ??
							this.$slots.invalid ??
							this.invalidLabel,
					)
				}
				if (this.hasValidLabelOrSlot) {
					return h(
						this.tag,
						{
							role,
						},
						this.$slots.valid?.() ?? this.validLabel,
					)
				}
				return h(
					this.tag,
					{
						role,
					},
					this.$slots.hint?.() ?? this.$slots.hint ?? this.hintLabel,
				)
			}
			return null
		},
	})

	return {
		hasInvalidLabelOrSlot,
		hasHintLabelOrSlot,
		hasValidLabelOrSlot,
		hasLoadingLabelOrSlot,
		hintSlotScope,
		HintSlot,
	}
}

export default HintSlotFactory
