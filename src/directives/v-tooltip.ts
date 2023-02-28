import { render, type Directive, type DirectiveBinding } from 'vue'
import VvTooltip from '../components/VvTooltip/VvTooltip.vue'
import type { Side } from '../constants'

const tooltip: Directive = {
	beforeMount(el: HTMLElement, binding: DirectiveBinding) {
		const tooltip = h(VvTooltip, {
			value: binding.value,
			position: binding.arg as Side,
		})
		render(tooltip, el)
	},
}

export default tooltip
