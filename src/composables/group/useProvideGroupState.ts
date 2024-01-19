import type { Emitter } from 'mitt'

/**
 * Share part of the state of the component with all its children.
 */
export function useProvideGroupState<
	TGroupState extends Record<
		string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Ref<unknown> | Emitter<any>
	>,
>(key: InjectionKey<TGroupState>, groupState: TGroupState) {
	provide(key, groupState)
}
