import type { Ref } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, unref } from 'vue'

export type { ScrollToOptions } from '@tanstack/vue-virtual'

function pxToNumber(value: undefined): undefined
function pxToNumber(value: string | number): number
function pxToNumber(value: string | number | undefined): number | undefined
function pxToNumber(value: string | number | undefined): number | undefined {
    if (value === undefined) {
        return undefined
    }
    if (typeof value === 'number') {
        return value
    }
    return Number.parseInt(value.replace('px', ''), 10)
}

function getHorizontalStyle(size: number) {
    return { width: `${size}px` }
}

function getVerticalStyle(size: number) {
    return { height: `${size}px` }
}

export function useVirtualScroll(settings: {
    scrollEl: HTMLElement | null | Ref<HTMLElement | null>
    count: number | Ref<number>
    estimateSize: string | number | ((index: number) => number) | Ref<string | number | ((index: number) => number)>
    getItemKey?: (index: number) => number | string | bigint
    overscan?: string | number | Ref<string | number>
    horizontal?: boolean | Ref<boolean>
}) {
    const virtualizer = useVirtualizer({
        get count() {
            return unref(settings.count)
        },
        getScrollElement: () => unref(settings.scrollEl),
        getItemKey: settings.getItemKey,
        estimateSize: (index: number) => {
            const estimateSize = unref(settings.estimateSize)
            if (typeof estimateSize === 'function') {
                return estimateSize(index)
            }
            return pxToNumber(estimateSize)
        },
        overscan: pxToNumber(unref(settings.overscan)),
        horizontal: unref(settings.horizontal),
    })

    const virtualItems = computed(() => virtualizer.value.getVirtualItems())
    const virtualItemsLength = computed(() => virtualItems.value.length)
    const firstVirtualItem = computed(() => virtualItems.value[0])
    const lastVirtualItem = computed(() => virtualItems.value[virtualItemsLength.value - 1])
    const totalSize = computed(
        () => virtualizer.value.getTotalSize() ?? 0,
    )

    const startSpacer = computed(() => {
        const size = firstVirtualItem.value?.start ?? 0
        return {
            show: size > 0,
            size,
            style: unref(settings.horizontal) ? getHorizontalStyle(size) : getVerticalStyle(size),
        }
    })
    const endSpacer = computed(() => {
        const end = lastVirtualItem.value?.end ?? 0
        const size = totalSize.value - end
        return {
            show: size > 0,
            size,
            style: unref(settings.horizontal) ? getHorizontalStyle(size) : getVerticalStyle(size),
        }
    })

    return {
        virtualizer,
        virtualItems,
        virtualItemsLength,
        firstVirtualItem,
        lastVirtualItem,
        totalSize,
        startSpacer,
        endSpacer,
    }
}
