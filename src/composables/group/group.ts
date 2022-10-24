import { ref, type Ref } from 'vue'
import type {
	IButtonGroupState,
	IGroupState,
	IInputGroupState,
	IGroupOptions,
	IButtonGroupOptions,
	IInputGroupOptions,
	ButtonGroup,
	InputGroup
} from './types'

export class GroupState implements IGroupState {
	key: symbol
	modelValue: Ref<any>
	disabled: Ref<boolean>

	constructor(key: symbol, state: IGroupOptions) {
		this.key = key
		this.modelValue = ref(state.modelValue)
		this.disabled = ref(state.disabled)
	}
}

export class ButtonGroupState extends GroupState implements IButtonGroupState {
	type: ButtonGroup = 'ButtonGroup'
	toggle: Ref<boolean>

	constructor(key: symbol, state: IButtonGroupOptions) {
		super(key, state)
		this.toggle = ref(state.toggle || false)
	}
}

export class InputGroupState extends GroupState implements IInputGroupState {
	type: InputGroup = 'InputGroup'
	readonly: Ref<boolean>

	constructor(key: symbol, state: IInputGroupOptions) {
		super(key, state)
		this.readonly = ref(state.readonly)
	}
}
