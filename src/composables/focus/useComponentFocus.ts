import type { Ref } from 'vue'
import { watch } from 'vue'
import { useFocus } from '@vueuse/core'

/**
 *
 */
export function useComponentFocus(
	inputTemplateRef: Ref<HTMLInputElement>,
	emit: (event: any, ...args: any[]) => void
) {
	const { focused } = useFocus(inputTemplateRef)

	watch(focused, (bFocus) => {
		if (bFocus) emit('focus', inputTemplateRef.value)
		else emit('blur', inputTemplateRef.value)
	})

	return {
		focused
	}
}
