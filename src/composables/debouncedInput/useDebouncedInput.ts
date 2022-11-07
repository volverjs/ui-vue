import type { Ref } from 'vue'

import { refDebounced } from '@vueuse/core'

import { watch, ref } from 'vue'

export function useDebouncedInput(
	inputText: Ref<any> | undefined,
	debounced: number | undefined,
	emit: (event: any, ...args: any[]) => void
) {
	const _text = ref(inputText?.value)
	const debouncedInputTextData = refDebounced(
		_text as Ref<any>,
		debounced || 0
	)
	watch(debouncedInputTextData, (v) => emit('update:modelValue', v))
	return _text
}
