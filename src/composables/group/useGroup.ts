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
	computed
} from 'vue'
import type { InjectionKey } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

export const VV_BUTTON_GROUP: InjectionKey<IVvGroup<Object | String | Number>> =
	Symbol('VV_BUTTON_GROUP')
export const VV_RADIO_GROUP: InjectionKey<IVvGroup<Object | String | Number>> =
	Symbol('VV_RADIO_GROUP')
export const VV_CHECK_GROUP: InjectionKey<IVvGroup<Object | String | Number>> =
	Symbol('VV_CHECK_GROUP')

export interface IVvGroup<T> {
	modelValue: T | null
	disabled: Boolean | null
	add(value: T): void
	remove(value: T): void
	contains(value: T): void
}
export interface IVvGroupOptions<T> {
	modelValue: Ref<T> | null
	disabled: Ref<Boolean> | null
}

export class Group<T> implements IVvGroup<T> {
	#modelValue: Ref<T | null>
	#disabled: Ref<Boolean>

	constructor(options: IVvGroupOptions<T>) {
		this.#modelValue = options.modelValue || ref(null)
		this.#disabled = options.disabled || ref(false)
	}

	get disabled(): Boolean {
		return this.#disabled?.value || false
	}

	get modelValue(): T | null {
		return this.#modelValue?.value || null
	}

	add(value: T | null) {
		if (Array.isArray(this.#modelValue.value)) {
			if (!ObjectUtilities.contains(value, this.#modelValue.value)) {
				this.#modelValue.value.push(value)
			}
		} else {
			this.#modelValue.value = value
		}
	}

	remove(value: T | null) {
		if (Array.isArray(this.#modelValue.value)) {
			if (!ObjectUtilities.contains(value, this.#modelValue.value)) {
				let indexElToRemove = ObjectUtilities.findIndexInList(
					value,
					this.#modelValue.value
				)
				if (indexElToRemove > -1)
					this.#modelValue.value.slice(indexElToRemove, 1)
			}
		} else {
			if (ObjectUtilities.equal(value, this.#modelValue.value))
				this.#modelValue.value = null
		}
	}

	contains(value: T) {
		if (Array.isArray(this.#modelValue.value))
			return ObjectUtilities.contains(value, this.#modelValue.value)
		else return ObjectUtilities.equals(value, this.#modelValue.value)
	}
}

export function useGroup<TModelValue>(key: Symbol): IVvGroup<TModelValue> {
	const { props, emit } = getCurrentInstance() as any
	const { modelValue, disabled } = toRefs(props)
	const group = new Group<TModelValue>({
		modelValue,
		disabled
	})

	provide(
		key,
		computed(() => group)
	)

	watch(
		() => group.modelValue,
		(newVal) => {
			console.log('Update:ModelValue', newVal)
			emit('update:modelValue', newVal)
		},
		{
			immediate: true
		}
	)

	return group
}

export interface IUseCurrentGroupApi<T> {
	group: IVvGroup<T> | null
	isInGroup: ComputedRef<Boolean>
}
export function useCurrentGroup<TModelValue>(
	groupKey: Symbol
): IUseCurrentGroupApi<TModelValue> {
	let group: IVvGroup<TModelValue> | null = inject(groupKey, null)

	const isInGroup = computed(() => ObjectUtilities.isNotEmpty(group))

	return {
		group,
		isInGroup
	}
}
