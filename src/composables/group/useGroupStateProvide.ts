import type { Emitter } from 'mitt'
import type { InjectionKey, Ref } from 'vue'

/**
 * Share part of the state of the component with all its children.
 */
export function useGroupStateProvide<
    TGroupState extends Record<
        string,
		Ref<unknown> | Emitter<any>
    >,
>(key: InjectionKey<TGroupState>, groupState: TGroupState) {
    provide(key, groupState)
}
