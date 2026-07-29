import type { MaybeRefOrGetter, Ref } from 'vue'

export interface DebouncedInput {
    /** Two-way model: reads the prop, writes through the debounce. */
    model: Ref
    /**
     * Emit a value that is still waiting for its timer. Call it wherever the
     * value has to be readable right away: blur, Enter, submit.
     */
    flush: () => void
    /** Drop a pending value without emitting it. */
    cancel: () => void
}

export function useDebouncedInput(
    modelValue: Ref | undefined,
    emit: (event: string, value: string | number) => void,
    ms: MaybeRefOrGetter<string | number | undefined> = 0,
    {
        getter = value => value,
        setter = value => value,
    }: {
        getter?: (value: string | number) => string | number
        setter?: (value: string | number) => string | number
    } = {},
): DebouncedInput {
    let timeout: ReturnType<typeof setTimeout> | undefined
    let pending: { value: string | number } | undefined

    const delay = computed(() => {
        const raw = toValue(ms) ?? 0
        const parsed = typeof raw === 'string' ? Number.parseInt(raw) : raw
        return Number.isNaN(parsed) ? 0 : parsed
    })

    function cancel() {
        if (timeout) {
            clearTimeout(timeout)
            timeout = undefined
        }
        pending = undefined
    }

    function flush() {
        if (!pending) {
            return
        }
        const { value } = pending
        cancel()
        emit('update:modelValue', setter(value))
    }

    // A timer surviving the component would emit into whatever the parent
    // renders next.
    onScopeDispose(cancel)

    const model = computed({
        get: () => getter(modelValue?.value),
        set: (value) => {
            // Without a debounce the update stays synchronous: a click, an
            // Enter or a submit handled in the same task as the keystroke has
            // to read the value just typed, and a `setTimeout(0)` is already a
            // task too late for that.
            if (delay.value <= 0) {
                cancel()
                emit('update:modelValue', setter(value))
                return
            }
            pending = { value }
            if (timeout) {
                clearTimeout(timeout)
            }
            timeout = setTimeout(flush, delay.value)
        },
    })

    return { model, flush, cancel }
}
