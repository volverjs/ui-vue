import type { Ref } from 'vue'
import type { IGroupState, IGroupStateOptions } from './types'

import { ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Group state manager
 * @template T
 */
export class GroupStateManager<T> implements IGroupState<T> {
	#modelValue: Ref<T | null>
	#disabled: Ref<Boolean>
	#readonly: Ref<Boolean>

	constructor(options: IGroupStateOptions<T>) {
		this.#modelValue = ref(
			options.modelValue?.value || null
		) as Ref<T | null>
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
			if (ObjectUtilities.equals(value, this.#modelValue.value))
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
