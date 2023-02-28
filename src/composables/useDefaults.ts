import type { ExtractPropTypes, PropType } from 'vue'

type VueProp =
	| StringConstructor
	| NumberConstructor
	| ObjectConstructor
	| FunctionConstructor
	| SymbolConstructor
	| ArrayConstructor
	| BooleanConstructor
	| PropType<unknown>

export function useDefaults<Definition>(
	componentName: string,
	propsDefinition: Definition,
	props: Readonly<ExtractPropTypes<Definition>>,
) {
	const volver = useVolver()

	const volverComponentDefaults = computed(() => {
		if (!volver || !volver.defaults.value?.[componentName]) {
			return undefined
		}
		return volver.defaults.value[componentName]
	})

	return computed(() => {
		if (volverComponentDefaults.value === undefined) {
			return props
		}
		const componentDefaults = volverComponentDefaults.value
		const simplifiedPropsDefinition = propsDefinition as {
			[key: string]:
				| VueProp
				| VueProp[]
				| { type: VueProp | VueProp[]; default?: unknown }
		}
		const simplifiedProps = props as Record<string, unknown>
		return Object.keys(simplifiedPropsDefinition).reduce((acc, key) => {
			const propValue = simplifiedProps[key]
			acc[key] = propValue
			if (key in componentDefaults) {
				// array of types
				if (Array.isArray(simplifiedPropsDefinition[key])) {
					const typeArray = simplifiedPropsDefinition[
						key
					] as VueProp[]
					if (typeArray.length) {
						const typeFunction = typeArray[0] as <T>() => T
						if (typeFunction === propValue) {
							acc[key] = componentDefaults[key]
						}
					}
				}
				// single type
				if (typeof simplifiedPropsDefinition[key] === 'function') {
					const typeFunction = simplifiedPropsDefinition[key] as <
						T,
					>() => T
					if (typeFunction() === propValue) {
						acc[key] = componentDefaults[key]
					}
				}
				// object with type and default
				if (typeof simplifiedPropsDefinition[key] === 'object') {
					let defaultValue = (
						simplifiedPropsDefinition[key] as { default: unknown }
					).default
					if (typeof defaultValue === 'function') {
						defaultValue = defaultValue()
					}
					if (typeof defaultValue === 'object') {
						if (
							JSON.stringify(defaultValue) ===
							JSON.stringify(propValue)
						) {
							acc[key] = componentDefaults[key]
						}
					} else if (defaultValue === propValue) {
						acc[key] = componentDefaults[key]
					}
				}
			}
			return acc
		}, {} as Record<string, unknown>) as Readonly<
			ExtractPropTypes<Definition>
		>
	})
}
