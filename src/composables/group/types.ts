import type { Ref, WritableComputedRef, ComputedRef } from 'vue'

/**
 * Stato condiviso da un nodo PADRE ad un gruppo di elementi figli.
 */
export interface IGroupState<T> {
	/**
	 * Shared ModelValue
	 */
	modelValue: T | null
	/**
	 * Shared Disabled state
	 */
	disabled: Boolean | null
	/**
	 * Shared Readonly state
	 */
	readonly: Boolean | null
	/**
	 * Aggiungi un valore al modelValue
	 */
	add(value: T): void
	/**
	 * Rimuovo un valore dal modelValue
	 */
	remove(value: T): void
	/**
	 * Controlla se un valore è contenuto nel modelValue
	 */
	contains(value: T): void
	/**
	 * Re-imposta interamente il modelValue
	 */
	setModelValue(value: T | null): void
}

/**
 * Options per creare un gruppo
 */
export interface IGroupStateOptions<T> {
	/**
	 * ModelValue iniziale
	 */
	modelValue: Ref<T> | null
	/**
	 * Disabled state iniziale
	 */
	disabled: Ref<Boolean>
	/**
	 * Readonly state iniziale
	 */
	readonly?: Ref<Boolean>
}

export interface UseGroupComponentProps {
	disabled: Ref<Boolean>
	readonly?: Ref<Boolean>
	modelValue: any
}

export interface UseGroupOptions {
	props: UseGroupComponentProps
	emit: Function
}

export interface UseGroupReturn<T> {
	group: IGroupState<T>
}

export interface UseSharedGroupStateReturn<T> {
	group: Ref<IGroupState<T>> | null
	wrappedModelValue: WritableComputedRef<T | null>
	isInGroup: ComputedRef<Boolean>
	isDisabled: ComputedRef<Boolean>
	isReadonly: ComputedRef<Boolean>
	checkIsSelected: Function
}
