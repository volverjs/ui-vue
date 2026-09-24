import type { Ref } from 'vue'
import { useId } from 'vue'

export function useUniqueId(id?: Ref<string | number | undefined>) {
    // useId() works only in setup and the id can change later
    const fallbackId = useId()
    return computed(() => String(id?.value || fallbackId))
}
