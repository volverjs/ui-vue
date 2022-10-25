import { ref, watch } from 'vue'
import { useFocus } from '@vueuse/core'

interface IFocusOptions {
	emit: () => any
}

/**
 *
 */
export function useInputFocus(context: any) {
	const { emit } = context
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
