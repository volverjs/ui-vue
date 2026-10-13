import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * Merge the modifiers of an item with the ones its group gives to every item,
 * each a space separated string or an array, without repeating a modifier.
 *
 * @param modifiers - The modifiers of the item
 * @param groupModifiers - The modifiers the group gives to its items
 */
export function useGroupModifiers(
    modifiers: MaybeRefOrGetter<string | string[] | undefined>,
    groupModifiers: MaybeRefOrGetter<string | string[] | undefined>,
) {
    return computed(() => {
        const toReturn = new Set<string>()
        const values = [toValue(modifiers), toValue(groupModifiers)]
        values.forEach((value) => {
            if (!value) {
                return
            }
            const list = Array.isArray(value) ? value : value.split(' ')
            list.forEach(modifier => toReturn.add(modifier))
        })
        return [...toReturn]
    })
}

export function useModifiers(
    prefix: string,
    modifiers?: Ref<unknown>,
    others?: Ref<Record<string, boolean>>,
) {
    return computed(() => {
        const toReturn: Record<string, boolean> = {
            [prefix]: true,
        }
        // props modifiers
        const modifiersArray
            = typeof modifiers?.value === 'string'
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
