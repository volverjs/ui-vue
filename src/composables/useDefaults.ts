import type { ExtractPropTypes, PropType } from 'vue'

type VueProp
    = | StringConstructor
        | NumberConstructor
        | ObjectConstructor
        | FunctionConstructor
        | SymbolConstructor
        | ArrayConstructor
        | BooleanConstructor
        | PropType<unknown>

type PropDefinition
    = | VueProp
        | VueProp[]
        | { type: VueProp | VueProp[], default?: unknown }

/**
 * Returns the value a prop should take: either the provided `propValue` or the
 * `componentDefault` when `propValue` still matches the prop definition default.
 * The three checks are intentionally independent (an array definition satisfies
 * both `Array.isArray` and `typeof === 'object'`).
 */
function resolveDefaultedProp(
    definition: PropDefinition,
    propValue: unknown,
    componentDefault: unknown,
): unknown {
    let value = propValue
    // array of types
    if (Array.isArray(definition) && definition.length) {
        const typeFunction = definition[0] as <T>() => T
        if (typeFunction === propValue) {
            value = componentDefault
        }
    }
    // single type
    if (typeof definition === 'function') {
        const typeFunction = definition as <T>() => T
        if (typeFunction() === propValue) {
            value = componentDefault
        }
    }
    // object with type and default
    if (typeof definition === 'object') {
        let defaultValue = (definition as { default: unknown }).default
        if (typeof defaultValue === 'function') {
            defaultValue = defaultValue()
        }
        const matches = typeof defaultValue === 'object'
            ? JSON.stringify(defaultValue) === JSON.stringify(propValue)
            : defaultValue === propValue
        if (matches) {
            value = componentDefault
        }
    }
    return value
}

export function useDefaults<Definition>(
    componentName: string,
    propsDefinition: Definition,
    props: Readonly<ExtractPropTypes<Definition>>,
) {
    const volver = useVolver()

    const volverComponentDefaults = computed(() => {
        if (!volver?.defaults.value?.[componentName]) {
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
                | { type: VueProp | VueProp[], default?: unknown }
        }
        const simplifiedProps = props as Record<string, unknown>
        return Object.keys(simplifiedPropsDefinition).reduce((acc, key) => {
            const propValue = simplifiedProps[key]
            acc[key] = key in componentDefaults
                ? resolveDefaultedProp(
                        simplifiedPropsDefinition[key],
                        propValue,
                        componentDefaults[key],
                    )
                : propValue
            return acc
        }, {} as Record<string, unknown>) as Readonly<
            ExtractPropTypes<Definition>
        >
    })
}
