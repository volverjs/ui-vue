import type { Directive, DirectiveBinding } from 'vue'

const contextmenu: Directive = {
	beforeUpdate(el: HTMLElement, binding: DirectiveBinding) {
		const clientX = ref(0)
		const clientY = ref(0)
		const virtualEl = {
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x: clientX.value,
					y: clientY.value,
					top: clientY.value,
					left: clientX.value,
					right: clientX.value,
					bottom: clientY.value,
				}
			},
		}
		if (binding.value?.init) {
			binding.value.init?.(virtualEl)
		}
		el.addEventListener(
			'contextmenu',
			function (ev) {
				if (binding.value?.show) {
					ev.preventDefault()
					clientX.value = ev.clientX
					clientY.value = ev.clientY
					binding.value.show?.()
					return false
				}
			},
			false,
		)
	},
}

export default contextmenu
