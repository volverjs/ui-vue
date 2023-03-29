import type { ExtractPropTypes, Ref } from 'vue'
import type { AccordionGroupState } from '../../types/group'
import { INJECTION_KEY_ACCORDION_GROUP } from '../../constants'

export const VvAccordionProps = {
	/**
	 * Accordion name
	 */
	name: String,
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
		default: undefined,
	},
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers: [String, Array],
	/**
	 * If true, the accordion will be disabled
	 */
	disabled: Boolean,
	/**
	 * If true, the accordion will be opened by default
	 */
	not: Boolean,
}

export const VvAccordionEvents = ['update:modelValue']
export type VvAccordionPropsTypes = ExtractPropTypes<typeof VvAccordionProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvAccordionPropsTypes,
	emit: (event: string, value: unknown) => void,
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<AccordionGroupState>(
			INJECTION_KEY_ACCORDION_GROUP,
		)

	// local props
	const { title, content } = toRefs(props)

	// group props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const not = getGroupOrLocalRef('not', props) as Ref<boolean>
	const collapse = getGroupOrLocalRef('collapse', props) as Ref<boolean>
	const modifiers = getGroupOrLocalRef('modifiers', props) as Ref<
		Array<string> | string
	>
	const disabled = computed(() =>
		Boolean(props.disabled || group?.value?.disabled.value),
	)

	return {
		// group props
		modelValue,
		not,
		isInGroup,
		group,
		collapse,
		modifiers,
		disabled,
		// local props
		title,
		content,
	}
}
