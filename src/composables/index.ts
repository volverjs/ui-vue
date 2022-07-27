import { computed, type ComputedRef } from 'vue'

/**
 * @description Create css modifiers classes
 * @param prefix - Prefix for css classes (e.g. 'vv-text')
 * @param modifiers - String modifier or Array of string modifiers
 * @returns {ComputedRef<string>} - css modifiers classes
 */
export function useModifiers(
	prefix = '',
	modifiers: string[] | string = []
): ComputedRef<string> {
	return computed(() => {
		if (typeof modifiers === 'string') {
			return `${prefix}--${modifiers}`
		} else if (Array.isArray(modifiers)) {
			return modifiers
				.map((modifier) => `${prefix}--${modifier}`)
				.join(' ')
		}
		return ''
	})
}
