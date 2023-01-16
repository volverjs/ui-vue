import { computed, unref, type Ref } from 'vue'

export function useTextCount(
	text: Ref<string | undefined | null> | string,
	options?: {
		mode?: string | boolean
		upperLimit?: number
		lowerLimit?: number
	}
) {
	const length = computed(() => {
		return (unref(text) ?? '').length
	})

	const gap = computed(() => {
		if (
			options?.lowerLimit !== undefined &&
			length.value < options?.lowerLimit
		) {
			return length.value - options.lowerLimit
		}
		if (
			options?.upperLimit !== undefined &&
			length.value < options?.upperLimit
		) {
			return options.upperLimit - length.value
		}
		return 0
	})

	const formatted = computed(() => {
		if (options?.mode === false) {
			return ''
		}

		if (options?.mode === 'limit') {
			return `${length.value} / ${
				options.lowerLimit ? `${options.lowerLimit}-` : ''
			}${options.upperLimit}`
		}

		if (options?.mode === 'countdown') {
			if (gap.value === 0) {
				return undefined
			}
			return gap
		}

		return length.value
	})

	return {
		length,
		gap,
		formatted
	}
}
