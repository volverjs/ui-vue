import type { Side } from '../constants'
import { type Directive, type DirectiveBinding, render } from 'vue'
import VvTooltip from '../components/VvTooltip/VvTooltip.vue'

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
