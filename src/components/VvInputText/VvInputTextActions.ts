import { type Component, h, computed } from 'vue'
import { type VvInputTextPropsTypes, TYPES } from '@/components/VvInputText'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import VvInputPasswordAction from '@/components/VvInputText/VvInputPasswordAction'
import VvInputStepAction from '@/components/VvInputText/VvInputStepAction'

export default function VvInputTextActionsFactory(
	type: string,
	parentProps: VvInputTextPropsTypes
): Component {
	return {
		name: 'VvInputTextActions',
		components: {
			VvIcon,
			VvInputPasswordAction,
			VvInputStepAction
		},
		setup() {
			const isDisabled = computed(() => {
				return parentProps.disabled || parentProps.readonly
			})

			return {
				isDisabled
			}
		},
		render() {
			let _actions = null
			switch (type) {
				case TYPES.PASSWORD: {
					const { onActionPasswordOn, onActionPasswordOff } =
						this.$attrs
					_actions = [
						h(VvInputPasswordAction, {
							disabled: this.isDisabled,
							onActionPasswordOn,
							onActionPasswordOff
						})
					]
					break
				}
				case TYPES.NUMBER: {
					const { onActionStepUp, onActionStepDown } = this.$attrs
					_actions = [
						h(VvInputStepAction, {
							mode: 'up',
							disabled:
								this.isDisabled ||
								(parentProps.max !== undefined &&
									parentProps.modelValue === parentProps.max),
							onActionStepUp,
							onActionStepDown
						}),
						h(VvInputStepAction, {
							mode: 'down',
							disabled:
								this.isDisabled ||
								(parentProps.min !== undefined &&
									parentProps.modelValue === parentProps.min),
							onActionStepUp,
							onActionStepDown
						})
					]
					break
				}
				default: {
					_actions = null
					break
				}
			}

			return Array.isArray(_actions)
				? h('div', { class: 'vv-input-text__actions-group' }, _actions)
				: _actions
		}
	}
}
