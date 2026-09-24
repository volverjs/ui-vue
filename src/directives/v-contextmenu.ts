import type { Directive, DirectiveBinding, Ref } from 'vue'
import type VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import { useDropdownContextmenu } from '@/composables'

function unbind(el: HTMLElement & { additionalData?: Record<string, any> }) {
    if (el?.additionalData?.onContextmenu) {
        el.removeEventListener('contextmenu', el.additionalData.onContextmenu)
    }
    if (el?.additionalData?.onScroll && el?.additionalData?.scrollContainerEl) {
        el.additionalData.scrollContainerEl.removeEventListener('scroll', el.additionalData.onScroll)
    }
    delete el.additionalData
}

const contextmenu: Directive = {
    // Bound on update and not on mount, since the dropdown is usually a
    // template ref, still empty on the first render. Every later render of the
    // host calls this again, and each call added another pair of listeners:
    // only a different dropdown binds anew now.
    beforeUpdate(el, binding: DirectiveBinding) {
        if (!binding.value || el.additionalData?.dropdown === binding.value) {
            return
        }
        unbind(el)
        const { onContextmenu, onScroll, getBoundingClientRect } = useDropdownContextmenu(binding as unknown as Ref<typeof VvDropdown>)
        binding.value.init({
            getBoundingClientRect,
        })
        el.addEventListener(
            'contextmenu',
            onContextmenu,
            false,
        )
        const scrollContainerEl = findScrollContainer(binding.value.$el)
        if (scrollContainerEl) {
            scrollContainerEl.addEventListener('scroll', onScroll)
        }
        el.additionalData = { dropdown: binding.value, onContextmenu, onScroll, scrollContainerEl }
    },
    beforeUnmount: unbind,
}

export default contextmenu
