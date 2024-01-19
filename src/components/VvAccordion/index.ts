import type { ExtractPropTypes } from 'vue'
import type { AccordionGroupState } from '../../types/group'
import { INJECTION_KEY_ACCORDION_GROUP } from '../../constants'
import { ModifiersProps } from '@/props'

export const VvAccordionProps = {
	...ModifiersProps,
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
export function useGroupProps(props: VvAccordionPropsTypes) {
	const { group, isInGroup } = useInjectedGroupState<AccordionGroupState>(
		INJECTION_KEY_ACCORDION_GROUP,
	)

	// group props
	const disabled = computed(() =>
		Boolean(props.disabled || group?.disabled.value),
	)
	// merge local and group modifiers
	const modifiers = computed(() => {
		let localModifiers = props.modifiers
		let groupModifiers = group?.modifiers.value

		const toReturn = new Set<string>()
		if (localModifiers) {
			if (!Array.isArray(localModifiers)) {
				localModifiers = localModifiers.split(' ')
			}
			localModifiers.forEach((modifier) => toReturn.add(modifier))
		}
		if (groupModifiers) {
			if (!Array.isArray(groupModifiers)) {
				groupModifiers = groupModifiers.split(' ')
			}
			groupModifiers.forEach((modifier) => toReturn.add(modifier))
		}
		return Array.from(toReturn)
	})

	return {
		// group props
		isInGroup,
		group,
		modifiers,
		disabled,
		bus: group?.bus,
	}
}
