import { get } from 'ts-dot-prop'
import type { Option } from '../types/generic'

export function useOptions(props: any) {
    const { options, labelKey, valueKey, disabledKey } = toRefs(props)

    const getOptionLabel = <T extends string | Option>(option: T): string => {
        if (typeof option === 'string') {
            return option
        }
        if (typeof labelKey.value === 'function') {
            return labelKey.value(option)
        }
        return String(
            labelKey.value ? get(option as object, labelKey.value) : option,
        )
    }

    const getOptionValue = <T extends string | Option>(option: T) => {
        if (typeof option === 'string') {
            return option
        }
        if (typeof valueKey.value === 'function') {
            return valueKey.value(option)
        }
        return valueKey.value ? get(option as object, valueKey.value) : option
    }

    const isOptionDisabled = <T extends string | Option>(option: T): boolean => {
        if (typeof option === 'string') {
            return false
        }
        if (typeof disabledKey.value === 'function') {
            return disabledKey.value(option)
        }
        return disabledKey.value ? get(option as object, disabledKey.value) : false
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
