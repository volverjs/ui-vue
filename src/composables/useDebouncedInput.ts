import type { Ref } from 'vue'

export function useDebouncedInput(
	modelValue: Ref | undefined,
	emit: (event: string, value: string | number) => void,
	ms: string | number = 0,
	{
		getter = (value) => value,
		setter = (value) => value,
	}: {
		getter?: (value: string | number) => string | number
		setter?: (value: string | number) => string | number
	} = {},
): Ref {
	let timeout: NodeJS.Timeout

	if (typeof ms === 'string') {
		ms = parseInt(ms)
	}

	return computed({
		get: () => getter(modelValue?.value),
		set: (value) => {
			if (timeout) {
				clearTimeout(timeout)
			}
			timeout = setTimeout(() => {
				emit('update:modelValue', setter(value))
			}, ms as number)
		},
	})
}
