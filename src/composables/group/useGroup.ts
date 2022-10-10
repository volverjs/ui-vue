import {
	getCurrentInstance,
	type WritableComputedRef,
	type ComputedRef,
	type Ref,
	toRefs,
	provide,
	inject,
	ref,
	watch,
	unref
} from 'vue'
import type { InjectionKey } from 'vue'
import { computed } from '@vue/reactivity'

export interface IVvGroup<T> {
	modelValue: T | null
	disabled: Boolean | null
}

export const VV_RADIO_GROUP: InjectionKey<IVvGroup<Object | String | Number>> =
	Symbol('VV_BUTTON_GROUP_MANAGER')

export class RadioGroup implements IVvGroup<Object | String | Number> {
	modelValue: Object | String | Number | null
	disabled: Boolean | null

	constructor(options) {
		this.modelValue = unref(options.modelValue)
		this.disabled = unref(options.disabled)
	}
}

export function useGroup(key: Symbol) {
	const { props, emit } = getCurrentInstance() as any
	const { modelValue, disabled } = toRefs(props)
	const group = ref(
		new RadioGroup({
			modelValue,
			disabled
		})
	)

	provide(key, {
		group,
		disabled
	})

	watch(
		() => group.value.modelValue,
		(newVal) => {
			emit('update:modelValue', newVal)
		},
		{
			immediate: true
		}
	)

	return {
		group
	}
}

export function useCurrentGroup(groupKey: Symbol) {
	let groupId: Symbol = groupKey
	let group: Ref<IVvGroup<Object | String | Number>> | null =
		inject(groupKey, null) || null

	// const { props } = getCurrentInstance() as any

	return {
		groupId,
		group
	}
}
