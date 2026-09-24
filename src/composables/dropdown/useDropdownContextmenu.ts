import type { Ref } from 'vue'
import type VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import { computed, getCurrentInstance, onMounted, onUnmounted, unref } from 'vue'

export function useDropdownContextmenu(dropdownEl: Ref<typeof VvDropdown>, targetEl?: Ref<HTMLElement> | HTMLElement) {
    const { x, y, getBoundingClientRect, onScroll } = useDropdownVirtualElement(dropdownEl)
    const onContextmenu = (event: MouseEvent) => {
        x.value = event.clientX
        y.value = event.clientY
        event.preventDefault()
        dropdownEl.value.show()
    }
    const target = computed(() => unref(targetEl))
    // whether a target was passed at all: a computed is always truthy, and a
    // template ref still holds null while setup runs
    if (targetEl && getCurrentInstance()) {
        onMounted(() => {
            target.value?.addEventListener('contextmenu', onContextmenu, false)
        })
        onUnmounted(() => {
            target.value?.removeEventListener('contextmenu', onContextmenu)
        })
    }
    return { x, y, getBoundingClientRect, onContextmenu, onScroll }
}
