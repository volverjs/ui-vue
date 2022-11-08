import type { Ref } from 'vue'
import type { VvInputTextPropsTypes } from './VvInputText'

import { computed, toRefs, unref } from 'vue'
import INPUT from './constants'

// interface useVvInputNumberProps {
// 	type: Ref<string>
// 	disabled: Ref<boolean>
// 	readonly: Ref<boolean>
// 	inputTemplateRef: Ref<HTMLInputElement>
// }

/**
 * Funzionalità input number
 */
export function useInputNumber(
	inputModelValue: Ref<any>,
	inputTemplateRef: Ref<HTMLInputElement>,
	props: VvInputTextPropsTypes
) {
	const { type, disabled, readonly } = toRefs(props)
	const isNumber = computed(() => type.value === INPUT.TYPES.NUMBER)

	function stepUp() {
		if (!disabled.value && !readonly.value) {
			inputTemplateRef.value.stepUp()
			inputModelValue.value = unref(inputTemplateRef.value).value
		}
	}
	function stepDown() {
		if (!disabled.value && !readonly.value) {
			inputTemplateRef.value.stepDown()
			inputModelValue.value = unref(inputTemplateRef.value).value
		}
	}

	return {
		isNumber,
		stepUp,
		stepDown
	}
}
