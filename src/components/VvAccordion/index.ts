import { type ExtractPropTypes, toRefs } from 'vue'
import type IAccordionGroupState from '@/composables/group/types/IAccordionGroupState'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { VV_ACCORDION_GROUP } from '@/constants'

export const VvAccordionProps = {
	/**
	 * Header title
	 */
	title: String,
	/**
	 * Content text
	 */
	content: String,
	/**
	 * (Optional) Defines if item is open. Event "update:modelValue" is emitted on accordion header click
	 */
	modelValue: {
		type: Boolean,
		default: undefined
	},
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers: [String, Array],
	/**
	 * If true, the accordion will be disabled
	 */
	disabled: Boolean
}

export const VvAccordionEvents = ['update:modelValue']
export type VvAccordionPropsTypes = ExtractPropTypes<typeof VvAccordionProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvAccordionPropsTypes,
	emit: (event: typeof VvAccordionEvents[number], value: unknown) => void
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IAccordionGroupState>(VV_ACCORDION_GROUP)

	// Local props
	const { modifiers, title, content } = toRefs(props)

	// Group props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const disabled = getGroupOrLocalRef('disabled', props)
	const collapse = getGroupOrLocalRef('collapse', props)

	return {
		// Group props
		modelValue,
		disabled,
		isInGroup,
		group,
		collapse,
		// Local props
		modifiers,
		title,
		content
	}
}
