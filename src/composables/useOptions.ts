import { get } from 'ts-dot-prop'
import type { Option } from '../types/generic'

export function useOptions(props: any) {
    const { options, labelKey, valueKey, disabledKey } = toRefs(props)

    const getOptionLabel = <T extends string | Option>(option: T): string => {
        if (typeof option === 'string') {
            return option
        }
        return String(
            typeof labelKey.value === 'function'
                ? labelKey.value(option)
                : get(option as object, labelKey.value),
        )
    }

    const getOptionValue = <T extends string | Option>(option: T) => {
        if (typeof option === 'string') {
            return option
        }

        return typeof valueKey.value === 'function'
            ? valueKey.value(option)
            : get(option as object, valueKey.value)
    }

    const isOptionDisabled = <T extends string | Option>(option: T): boolean => {
        if (typeof option === 'string') {
            return false
        }

        return typeof disabledKey.value === 'function'
            ? disabledKey.value(option)
            : get(option as object, disabledKey.value)
    }

    const getOptionGrouped = <T extends string | Option>(option: T) => {
        if (typeof option == 'string') {
            return []
        }
        if (typeof option === 'object' && option && 'options' in option) {
            return option.options as T[]
        }
        return []
    }

    return {
        options,
        getOptionLabel,
        getOptionValue,
        isOptionDisabled,
        getOptionGrouped,
    }
}
