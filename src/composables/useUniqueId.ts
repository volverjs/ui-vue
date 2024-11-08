import { type Ref, useId } from 'vue'

export function useUniqueId(id?: Ref<string | number | undefined>) {
    return computed(() => String(id?.value || useId()))
}
