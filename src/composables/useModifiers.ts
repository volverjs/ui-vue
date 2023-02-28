import type { Ref } from 'vue'

export function useModifiers(
	prefix: string,
	modifiers?: Ref<string | string[] | unknown | unknown[] | undefined>,
	others?: Ref<Record<string, boolean>>,
) {
	return computed(() => {
		const toReturn: Record<string, boolean> = {
			[prefix]: true,
		}
		// props modifiers
		const modifiersArray =
			typeof modifiers?.value === 'string'
				? modifiers.value.split(' ')
				: modifiers?.value
		if (modifiersArray) {
			if (Array.isArray(modifiersArray)) {
				modifiersArray.forEach((modifier) => {
					if (modifier) {
						toReturn[`${prefix}--${modifier}`] = true
					}
				})
			}
		}

		// others modifiers
		if (others) {
			Object.keys(others.value).forEach((key) => {
				toReturn[`${prefix}--${key}`] = unref(others.value[key])
			})
		}

		return toReturn
	})
}
