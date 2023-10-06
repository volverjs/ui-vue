import { render, type Directive, type DirectiveBinding } from 'vue'
import VvTooltip from '../components/VvTooltip/VvTooltip.vue'
import { Side } from '../constants'

const tooltip: Directive = (() => {
	return {
		beforeMount(el: HTMLElement, binding: DirectiveBinding) {
			const tooltip = h(VvTooltip, {
				value: binding.value,
				position: binding.arg as Side,
			})
			render(tooltip, el)
		},
		updated(el: HTMLElement, binding: DirectiveBinding) {
			const tooltip = h(VvTooltip, {
				value: binding.value,
				position: binding.arg as Side,
			})
			render(tooltip, el)
		},
	}
})()

export default tooltip
