import type { MaybeElement, MaybeElementRef } from '@vueuse/core'

export function useComponentFocus(
    inputTemplateRef: MaybeElementRef<MaybeElement>,
    emit: ((name: 'blur', ...args: any[]) => void) & ((name: 'focus', ...args: any[]) => void) & ((name: any, ...args: any[]) => void),
) {
    const { focused } = useFocus(inputTemplateRef)

    watch(focused, (newValue) => {
        emit(newValue ? 'focus' : 'blur', unref(inputTemplateRef))
    })

    return {
        focused,
    }
}
