import type { Ref, InjectionKey } from 'vue'
import type { Emitter } from 'mitt'

/**
 * Share part of the state of the component with all its children.
 */
export function useProvideGroupState<
	TGroupState extends Record<
		string,
		Ref<unknown> | Emitter<any>
	>,
>(key: InjectionKey<TGroupState>, groupState: TGroupState) {
    provide(key, groupState)
}
