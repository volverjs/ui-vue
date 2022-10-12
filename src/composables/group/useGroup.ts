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
	computed,
	unref
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
	readonly: Boolean | null
	add(value: T): void
	remove(value: T): void
	contains(value: T): void
	setModelValue(value: T): void
}
export interface IVvGroupOptions<T> {
	modelValue: Ref<T> | null
	disabled: Ref<Boolean>
	readonly: Ref<Boolean>
}

export class Group<T> implements IVvGroup<T> {
	#modelValue: Ref<T | null>
	#disabled: Ref<Boolean>
	#readonly: Ref<Boolean>

	constructor(options: IVvGroupOptions<T>) {
		this.#modelValue = options.modelValue || ref(null)
		this.#disabled = options.disabled || ref(false)
		this.#readonly = options.readonly || ref(false)
	}

	get disabled(): Boolean {
		return this.#disabled?.value || false
	}

	get modelValue(): T | null {
		return this.#modelValue?.value || null
	}

	get readonly(): Boolean {
		return this.#readonly?.value || null
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
			if (ObjectUtilities.contains(value, this.#modelValue.value)) {
				let indexElToRemove = ObjectUtilities.findIndexInList(
					value,
					this.#modelValue.value
				)
				if (indexElToRemove > -1) {
					this.#modelValue.value = this.#modelValue.value.filter(
						(el, elIndex) => elIndex !== indexElToRemove
					) as T
				}
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

	setModelValue(value: T) {
		this.#modelValue.value = value
	}
}

export function useGroup<TModelValue>(key: Symbol): IVvGroup<TModelValue> {
	const { props, emit } = getCurrentInstance() as any
	const { modelValue, disabled, readonly } = toRefs(props)
	const group = new Group<TModelValue>({
		modelValue,
		disabled,
		readonly
	})

	provide(
		key,
		computed(() => group)
	)

	watch(
		() => group.modelValue,
		(newVal) => {
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

export function useWrapInGroup<TModelValue>(groupKey, { props, context }) {
	const { emit } = context
	const { modelValue, disabled, readonly } = toRefs(props)

	let group: Ref<IVvGroup<TModelValue>> | null = inject(groupKey, null)

	const isInGroup = computed(() => ObjectUtilities.isNotEmpty(group))
	const wrappedModelValue = computed({
		get: () => {
			if (isInGroup.value) return unref(group)?.modelValue
			else return modelValue?.value
		},
		set: (value) => {
			if (!isInGroup.value) {
				emit('update:modelValue', value)
				return
			}

			unref(group)?.setModelValue(value)
		}
	})
	const isDisabled = computed(() => {
		return isInGroup.value ? unref(group)?.disabled : disabled?.value
	})
	const isReadonly = computed(() => {
		return isInGroup.value ? unref(group)?.readonly : readonly?.value
	})

	const checkIsSelected = (value) => {
		return (
			ObjectUtilities.isNotEmpty(wrappedModelValue.value) &&
			ObjectUtilities.equals(wrappedModelValue.value, value)
		)
	}

	return {
		group,
		wrappedModelValue,
		isInGroup,
		isDisabled,
		isReadonly,
		checkIsSelected
	}
}
