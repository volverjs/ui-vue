import type { Option } from '../types/generic'
import { getProperty } from 'dot-prop'

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
            labelKey.value ? getProperty(option, labelKey.value) : option,
        )
    }

    const getOptionValue = <T extends string | Option>(option: T) => {
        if (typeof option === 'string') {
            return option
        }
        if (typeof valueKey.value === 'function') {
            return valueKey.value(option)
        }
        return valueKey.value ? getProperty(option, valueKey.value) : option
    }

    const isOptionDisabled = <T extends string | Option>(option: T): boolean => {
        if (typeof option === 'string') {
            return false
        }
        if (typeof disabledKey.value === 'function') {
            return disabledKey.value(option)
        }
        return disabledKey.value ? Boolean(getProperty(option, disabledKey.value)) : false
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
