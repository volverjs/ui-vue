import { computed, unref, type ComputedRef, type Ref } from 'vue'

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

interface IBemModifiers {
	[key: string]:
		| Ref<boolean>
		| Ref<string | unknown[] | undefined>
		| undefined
	variant: Ref<string | unknown[] | undefined> | undefined
}

export function useBemModifiers(prefix = '', modifiers: IBemModifiers) {
	if (!prefix) return {}
	if (!modifiers) return {}

	const baseCssClass: object = { [`${prefix}`]: true }

	const bemCssClasses = computed(() => {
		return Object.keys(modifiers).reduce((acc, k) => {
			const _modifier = unref(modifiers[k] as Ref<any>) || false

			if (!_modifier) return acc

			if (k === 'variant') {
				const _reduceModifiers = Array.isArray(_modifier)
					? _modifier
					: [_modifier]
				return {
					...acc,
					..._reduceModifiers.reduce(
						(accVariant: object, currentVariant: string) => {
							return {
								...accVariant,
								[`${prefix}--${currentVariant}`]: true
							}
						},
						{}
					)
				}
			} else {
				return {
					...acc,
					[`${prefix}--${k}`]: _modifier
				}
			}
		}, baseCssClass)
	})

	return {
		bemCssClasses
	}
}
