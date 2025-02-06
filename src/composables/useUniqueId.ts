import type { Ref } from 'vue'
import { useId } from 'vue'

export function useUniqueId(id?: Ref<string | number | undefined>) {
    return computed(() => String(id?.value || useId()))
}
