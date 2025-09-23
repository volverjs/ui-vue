import type { Directive, DirectiveBinding } from 'vue'
import type VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import { useDropdownContextmenu } from '@/composables'

const contextmenu: Directive = {
    beforeUpdate(el, binding: DirectiveBinding) {
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
        el.additionalData = { onContextmenu, onScroll, scrollContainerEl }
    },
    beforeUnmount(el) {
        if (el?.additionalData?.onContextmenu) {
            el.removeEventListener('contextmenu', el.additionalData.onContextmenu)
        }
        if (el?.additionalData?.onScroll && el?.additionalData?.scrollContainerEl) {
            el.additionalData.scrollContainerEl.removeEventListener('scroll', el.additionalData.onScroll)
        }
    },
}

export default contextmenu
