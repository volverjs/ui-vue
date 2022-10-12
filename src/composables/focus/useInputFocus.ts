import { ref, watch } from 'vue'
import { useFocus } from '@vueuse/core'

/**
 *
 */
export function useInputFocus(context) {
	const { props, emit } = context
	const input = ref()
	const { focused } = useFocus(input)

	watch(focused, (bFocus) => {
		if (bFocus) emit('focus', input.value)
		else emit('blur', input.value)
	})

	return {
		input,
		focused
	}
}
