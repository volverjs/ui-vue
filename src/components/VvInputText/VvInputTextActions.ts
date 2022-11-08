import type { VvInputTextPropsTypes } from './VvInputText'
import type { Component } from 'vue'

import { h } from 'vue'
import VvIcon from '../VvIcon/VvIcon.vue'

const VvInputTextAction: Component = {
	components: {
		VvIcon
	},
	props: {
		disabled: Boolean,
		icon: String
	},
	render() {
		const icon = h(VvIcon, { name: this.icon })

		return h(
			'button',
			{
				disabled: this.disabled
			},
			icon
		)
	}
}

export function VvInputTextActionsFactory(
	parentProps: VvInputTextPropsTypes
): Component {
	return {
		name: 'VvInputTextActions',
		components: {
			VvInputTextAction,
			VvIcon
		},
		render() {}
	}
}
