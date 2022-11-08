import { computed, unref, type Ref } from 'vue'
import ObjectUtilities from '@/utils/ObjectUtilities'

interface IBemModifiers {
	[key: string]:
		| Ref<boolean>
		| Ref<string | unknown[] | undefined>
		| undefined
	modifiers?: Ref<string | unknown[] | undefined> | undefined
}

export function useBemModifiers(prefix: string, modifiers: IBemModifiers) {
	const baseCssClass: object = { [`${prefix}`]: true }

	const bemCssClasses = computed(() => {
		return (
			Object.keys(modifiers).reduce((acc, k) => {
				const _modifier = unref(modifiers[k] as Ref<any>) || false

				if (!_modifier) return acc

				if (k === 'modifiers') {
					const _reduceModifiers = Array.isArray(_modifier)
						? _modifier
						: [_modifier]
					return {
						...acc,
						..._reduceModifiers.reduce(
							(accVariant: object, currentVariant: string) => {
								return {
									...accVariant,
									[`${prefix}--${ObjectUtilities.kebabCase(
										currentVariant
									)}`]: true
								}
							},
							{}
						)
					}
				} else {
					return {
						...acc,
						[`${prefix}--${ObjectUtilities.kebabCase(k)}`]:
							_modifier
					}
				}
			}, baseCssClass) || {}
		)
	})

	return {
		bemCssClasses
	}
}
