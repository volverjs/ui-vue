import type { Component } from 'vue'
import {
	type VvInputTextPropsTypes,
	INPUT_TYPES,
} from '@/components/VvInputText'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import VvInputPasswordAction from '@/components/VvInputText/VvInputPasswordAction'
import VvInputStepAction from '@/components/VvInputText/VvInputStepAction'
import VvInputClearAction from '@/components/VvInputText/VvInputClearAction'

export default function VvInputTextActionsFactory(
	type: string,
	parentProps: VvInputTextPropsTypes,
): Component {
	return {
		name: 'VvInputTextActions',
		components: {
			VvIcon,
			VvInputPasswordAction,
			VvInputStepAction,
			VvInputClearAction,
		},
		setup() {
			const isDisabled = computed(() => {
				return parentProps.disabled || parentProps.readonly
			})

			return {
				isDisabled,
				labelStepUp: parentProps.labelStepUp,
				labelStepDown: parentProps.labelStepDown,
				labelShowPassword: parentProps.labelShowPassword,
				labelHidePassword: parentProps.labelHidePassword,
				labelClear: parentProps.labelClear,
				iconShowPassword: parentProps.iconShowPassword,
				iconHidePassword: parentProps.iconHidePassword,
			}
		},
		render() {
			let actions = null
			switch (type) {
				case INPUT_TYPES.SEARCH: {
					const { onClear } = this.$attrs
					actions = [
						h(VvInputClearAction, {
							disabled: this.isDisabled,
							label: this.labelShowPassword,
							onClear,
						}),
					]
					break
				}
				case INPUT_TYPES.PASSWORD: {
					const { onTogglePassword } = this.$attrs
					actions = [
						h(VvInputPasswordAction, {
							disabled: this.isDisabled,
							onTogglePassword,
							labelShow: this.labelShowPassword,
							labelHide: this.labelHidePassword,
							iconShow: this.iconShowPassword,
							iconHide: this.iconHidePassword,
						}),
					]
					break
				}
				case INPUT_TYPES.NUMBER: {
					const { onStepUp, onStepDown } = this.$attrs
					actions = [
						h(VvInputStepAction, {
							mode: 'up',
							disabled:
								this.isDisabled ||
								(parentProps.max !== undefined &&
									parentProps.modelValue === parentProps.max),
							label: this.labelStepUp,
							onStepUp,
							onStepDown,
						}),
						h(VvInputStepAction, {
							mode: 'down',
							disabled:
								this.isDisabled ||
								(parentProps.min !== undefined &&
									parentProps.modelValue === parentProps.min),
							label: this.labelStepDown,
							onStepUp,
							onStepDown,
						}),
					]
					break
				}
			}

			return Array.isArray(actions)
				? h('div', { class: 'vv-input-text__actions-group' }, actions)
				: actions
		},
	}
}
