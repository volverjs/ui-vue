import { uid } from 'uid'
import type { Ref } from 'vue'

export function useUniqueId(id?: Ref<string | number | undefined>) {
    return computed(() => String(id?.value || uid()))
}
