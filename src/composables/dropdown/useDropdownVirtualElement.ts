import type { Ref } from 'vue'
import type VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import { onMounted, ref } from 'vue'

export function useDropdownVirtualElement(dropdownEl: Ref<typeof VvDropdown>) {
    const x = ref(0)
    const y = ref(0)

    const scrollContainerEl = ref<HTMLElement>()
    let scrollXDelta = 0
    let scrollYDelta = 0
    let lastScrollTop = 0
    let lastScrollLeft = 0
    const onScroll = (event: HTMLElementEventMap['scroll']) => {
        const scrollEl = event.target as HTMLElement
        scrollXDelta = scrollEl.scrollLeft - lastScrollLeft
        scrollYDelta = scrollEl.scrollTop - lastScrollTop
        y.value = y.value - scrollYDelta
        x.value = x.value - scrollXDelta
        lastScrollLeft = scrollEl.scrollLeft
        lastScrollTop = scrollEl.scrollTop
    }
    const getBoundingClientRect = () => ({
        width: 0,
        height: 0,
        x: x.value,
        y: y.value,
        top: y.value,
        left: x.value,
        right: x.value,
        bottom: y.value,
    })

    if (getCurrentInstance()) {
        onMounted(() => {
            if (dropdownEl.value) {
                dropdownEl.value.init({
                    getBoundingClientRect,
                })
                scrollContainerEl.value = findScrollContainer(dropdownEl.value.$el)
                if (scrollContainerEl.value) {
                    scrollContainerEl.value.addEventListener('scroll', onScroll)
                }
            }
        })

        onUnmounted(() => {
            if (scrollContainerEl.value) {
                scrollContainerEl.value.removeEventListener('scroll', onScroll)
            }
        })
    }
    return { x, y, getBoundingClientRect, onScroll }
}
