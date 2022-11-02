import { VV_ACCORDION_GROUP, VV_BUTTON_GROUP } from '../../constants'
import { ref, toRefs, type Ref } from 'vue'
import type {
	IButtonGroupState,
	IGroupState,
	IInputGroupState,
	IGroupOptions,
	IButtonGroupOptions,
	IInputGroupOptions,
	ButtonGroup,
	InputGroup,
	AccordionGroup,
	IAccordionGroupOptions,
	IAccordionGroupState
} from './types'

export class GroupState implements IGroupState {
	key: symbol
	modelValue: Ref<any>
	disabled: Ref<boolean>

	constructor(key: symbol, state: IGroupOptions) {
		this.key = key
		this.modelValue = state.modelValue || ref(null)
		this.disabled = state.disabled || ref(false)
	}
}

export class AccordionGroupState
	extends GroupState
	implements IAccordionGroupState
{
	type: AccordionGroup = 'AccordionGroup'
	iconRight: Ref<boolean>
	bordered: Ref<boolean>
	accordion: Ref<boolean>

	constructor(state: IAccordionGroupOptions) {
		super(VV_ACCORDION_GROUP, state)
		this.iconRight = state.iconRight || ref(false)
		this.bordered = state.bordered || ref(false)
		this.accordion = state.accordion || ref(false)
	}
}

export class ButtonGroupState extends GroupState implements IButtonGroupState {
	type: ButtonGroup = 'ButtonGroup'
	toggle: Ref<boolean>

	constructor(state: IButtonGroupOptions) {
		super(VV_BUTTON_GROUP, state)
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
