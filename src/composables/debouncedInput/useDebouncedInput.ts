import { type Ref, computed } from 'vue'

import { useDebounceFn } from '@vueuse/core'

export function useDebouncedInput(
	modelValue: Ref,
	emit: (event: string, value: unknown) => void,
	ms = 0
): Ref {
	return computed({
		get: () => modelValue.value,
		set: (value) =>
			useDebounceFn(() => {
				emit('update:modelValue', value)
			}, ms)()
	})
}
