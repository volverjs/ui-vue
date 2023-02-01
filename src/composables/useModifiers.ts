import type { Ref } from 'vue'

export function useBemModifiers(
	prefix: string,
	modifiers?: Ref<string | string[] | unknown | unknown[] | undefined>,
	others?: Ref<Record<string, boolean>>,
) {
	return computed(() => {
		const toReturn: Record<string, boolean> = {
			[prefix]: true,
		}
		// props modifiers
		let modifiersArray = unref(modifiers)
		if (modifiersArray) {
			if (
				!Array.isArray(modifiersArray) &&
				typeof modifiersArray === 'string'
			) {
				modifiersArray = modifiersArray.split(' ')
			}
			if (Array.isArray(modifiersArray)) {
				modifiersArray.forEach((modifier) => {
					toReturn[`${prefix}--${modifier}`] = true
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
