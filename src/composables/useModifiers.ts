import { computed, unref, type Ref } from 'vue'
import { kebabCase } from '@/utils/ObjectUtilities'

interface IBemModifiers {
	[key: string]:
		| Ref<boolean>
		| Ref<string | unknown[] | undefined>
		| boolean
		| string
		| string[]
		| undefined
		| unknown[]
	modifiers?:
		| Ref<string | unknown[] | undefined>
		| undefined
		| string[]
		| string
		| unknown[]
}

export function useBemModifiers(prefix: string, modifiers: IBemModifiers) {
	const baseCssClass: object = { [`${prefix}`]: true }

	const bemCssClasses = computed(() => {
		return (
			Object.keys(modifiers).reduce((acc, item) => {
				const _modifier =
					unref(modifiers[item] as Ref<string | string[]>) || false

				if (!_modifier) return acc

				if (item === 'modifiers') {
					const _reduceModifiers = Array.isArray(_modifier)
						? _modifier
						: _modifier.split(' ')
					return {
						...acc,
						..._reduceModifiers.reduce(
							(accVariant: object, currentVariant: string) => {
								return {
									...accVariant,
									[`${prefix}--${kebabCase(currentVariant)}`]:
										true,
								}
							},
							{},
						),
					}
				} else {
					return {
						...acc,
						[`${prefix}--${kebabCase(item)}`]: _modifier,
					}
				}
			}, baseCssClass) || {}
		)
	})

	return {
		bemCssClasses,
	}
}

export function toBem(prefix: string, modifiers: IBemModifiers) {
	const baseCssClass: object = { [`${prefix}`]: true }

	return (
		Object.keys(modifiers).reduce((acc, k) => {
			const _modifier = unref(modifiers[k] as Ref<unknown>) || false

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
								[`${prefix}--${kebabCase(currentVariant)}`]:
									true,
							}
						},
						{},
					),
				}
			} else {
				return {
					...acc,
					[`${prefix}--${kebabCase(k)}`]: _modifier,
				}
			}
		}, baseCssClass) || {}
	)
}
