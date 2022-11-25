import { type Ref, watch } from 'vue'
import { useFocus } from '@vueuse/core'

/**
 *
 */
export function useComponentFocus(
	inputTemplateRef: Ref<HTMLInputElement>,
	emit: (event: 'focus' | 'blur', value: unknown) => void
) {
	const { focused } = useFocus(inputTemplateRef)

	watch(focused, (newValue) => {
		emit(newValue ? 'focus' : 'blur', inputTemplateRef.value)
	})

	return {
		focused
	}
}
