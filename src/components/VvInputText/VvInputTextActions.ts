/* eslint-disable vue/one-component-per-file */
import type { VvInputTextPropsTypes } from './VvInputText'
import { computed, type Component } from 'vue'

import { h, ref, defineComponent } from 'vue'
import VvIcon from '../VvIcon/VvIcon.vue'
import { TYPES, TYPES_ICON } from './constants'

const VvInputPasswordAction = defineComponent({
	components: {
		VvIcon
	},
	props: {
		disabled: Boolean
	},
	setup(props, { emit }) {
		const active = ref(false)
		const activeIcon = computed(() =>
			active.value ? TYPES_ICON.PASSWORD_OFF : TYPES_ICON.PASSWORD_ON
		)

		function onClick() {
			if (!props.disabled) {
				active.value = !active.value
				emit(
					active.value ? 'action-password-on' : 'action-password-off'
				)
			}
		}

		return {
			activeIcon,
			onClick
		}
	},
	render() {
		const icon = h(VvIcon, { name: this.activeIcon })

		return h(
			'button',
			{
				disabled: this.disabled,
				class: ['vv-input-text__action'],
				onClick: this.onClick
			},
			icon
		)
	}
})
const VvInputStepAction = defineComponent({
	components: {
		VvIcon
	},
	props: {
		disabled: Boolean,
		mode: {
			type: String,
			validator: (v: string) => ['up', 'down'].includes(v),
			default: 'up'
		}
	},
	setup(props, { emit }) {
		function onClick() {
			if (!props.disabled) {
				emit(
					props.mode === 'up' ? 'action-step-up' : 'action-step-down'
				)
			}
		}

		return {
			onClick
		}
	},
	render() {
		return h('button', {
			class: [
				'vv-input-text__action-chevron',
				this.mode === 'up' && 'vv-input-text__action-chevron-up'
			],
			disabled: this.disabled,
			onClick: this.onClick
		})
	}
})

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
