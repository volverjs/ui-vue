import type { Ref } from 'vue'
import type { IButtonGroupState, IInputGroupState } from './types'

import { ref, isRef, toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Subset di prop che posso condividere
 */
export interface GroupParentState {
	modelValue: Ref<any>
	disabled: Ref<Boolean>
	toggle?: Ref<Boolean>
	readonly?: Ref<Boolean>
}

export class ButtonGroupState implements IButtonGroupState {
	type: 'ButtonGroup'

	key: Symbol
	modelValue: Ref<any>
	disabled: Ref<Boolean>
	toggle: Ref<Boolean>

	constructor(key: Symbol, state: GroupParentState) {
		this.type = 'ButtonGroup'

		if (!isRef(state.modelValue)) throw Error('ModelValue is not a Ref')
		if (!isRef(state.disabled)) throw Error('Disabled is not a Ref')
		if (!isRef(state.toggle)) throw Error('Toggle is not a Ref')

		this.key = key
		this.modelValue = ref(state.modelValue?.value || null)
		this.disabled = state.disabled
		this.toggle = state.toggle
	}

	static create(key: Symbol, parentProps: any): ButtonGroupState {
		const { modelValue, disabled, toggle } = toRefs(parentProps)
		return new ButtonGroupState(key, { modelValue, disabled, toggle })
	}
}

export class InputGroupState implements IInputGroupState {
	type: 'InputGroup'

	key: Symbol
	modelValue: Ref<any>
	disabled: Ref<Boolean>
	readonly: Ref<Boolean>

	constructor(key: Symbol, state: GroupParentState) {
		this.type = 'InputGroup'

		if (!isRef(state.modelValue)) throw Error('ModelValue is not a Ref')
		if (!isRef(state.disabled)) throw Error('Disabled is not a Ref')
		if (!isRef(state.readonly)) throw Error('readonly is not a Ref')

		this.key = key
		this.modelValue = ref(state.modelValue?.value || null)
		this.disabled = state.disabled
		this.readonly = state.readonly
	}

	static create(key: Symbol, parentProps: any): InputGroupState {
		const { modelValue, disabled, readonly } = toRefs(parentProps)
		return new InputGroupState(key, { modelValue, disabled, readonly })
	}
}
