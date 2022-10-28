import { computed, type ComputedRef } from 'vue'

/**
 * @description Create css modifiers classes
 * @param prefix - Prefix for css classes (e.g. 'vv-text', 'vv-icon', etc)
 * @param modifiers - String modifier or Array of string modifiers
 * @returns {ComputedRef<string>} - Reactive css modifiers classes
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

import type { IValid, IError } from '../types/props'

type IBemValid = Pick<IValid, 'valid'>
type IBemError = Pick<IError, 'error'>

type IBemModifiers = IBemValid & IBemError

export function useBemModifiers(prefix = '', props: IBemModifiers) {}
