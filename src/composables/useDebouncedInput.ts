import { type Ref, computed } from 'vue'

export function useDebouncedInput(
	modelValue: Ref | undefined,
	emit: (event: string, value: unknown) => void,
	ms: string | number = 0,
): Ref {
	let timeout: NodeJS.Timeout

	if (typeof ms === 'string') {
		ms = parseInt(ms)
	}

	return computed({
		get: () => modelValue?.value,
		set: (value) => {
			if (timeout) {
				clearTimeout(timeout)
			}
			timeout = setTimeout(() => {
				emit('update:modelValue', value)
			}, ms as number)
		},
	})
}
