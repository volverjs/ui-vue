import type { PlayAttributes } from '@/test/types'
import { waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'

function parseItemClasses(itemClass: any): string[] {
    if (Array.isArray(itemClass)) {
        return itemClass
    }
    if (typeof itemClass === 'string') {
        return itemClass.split(' ').filter(Boolean)
    }
    return []
}

export async function defaultTest(
    { canvasElement, args }: PlayAttributes = {} as PlayAttributes,
) {
    const element = await within(canvasElement).findByTestId('virtual-scroll')

    // check component is rendered
    await expect(element).toBeVisible()

    // check wrapper semantics (ul/ol/menu) and focusability
    // The component root IS the wrapper; don't select nested ULs from slot
    const wrapper = element
    await expect(wrapper !== null).toBe(true)
    await expect(wrapper?.getAttribute('tabindex')).toBe('0')
    await expect(['UL', 'OL', 'MENU'].includes(wrapper.tagName)).toBe(true)

    // check visible items are rendered and are virtualized
    const liItems = [...wrapper.querySelectorAll('li')]
    await expect(liItems.length).toBeGreaterThan(0)
    if (Array.isArray(args?.items)) {
        await expect(liItems.length).toBeLessThan(args.items.length)
    }

    // check itemProps class applied on items when provided
    const itemClass = typeof args?.itemProps === 'object' ? args.itemProps?.class : undefined
    if (itemClass && liItems[0]) {
        const classes = parseItemClasses(itemClass)
        if (classes.length) {
            await expect(liItems[0]).toHaveClass(classes)
        }
    }

    // check spacer elements exist with presentation role (at least one)
    // Use DOM query instead of accessibility query because spacers are aria-hidden
    const spacers = element.querySelectorAll('[role="presentation"]')
    await expect(spacers.length).toBeGreaterThan(0)

    // check accessibility
    await expect(element).toHaveNoViolations()
}

async function expectSpacersToKeepTheirSize(spacers: HTMLElement[], horizontal: boolean) {
    for (const spacer of spacers) {
        const { width, height } = spacer.getBoundingClientRect()
        const size = Number.parseFloat(horizontal ? spacer.style.width : spacer.style.height)
        await expect(size).toBeGreaterThan(0)
        await expect(horizontal ? width : height).toBeCloseTo(size, 0)
    }
}

/**
 * The container is a flex container along the scroll axis, where an empty
 * spacer would shrink to 0 as soon as the rows overflow it.
 */
export async function flexContainerTest(
    { canvasElement, args }: PlayAttributes = {} as PlayAttributes,
) {
    const element = await within(canvasElement).findByTestId('virtual-scroll')
    const horizontal = Boolean(args?.horizontal)
    // spacers are aria-hidden, the only children of the wrapper that are
    const getSpacers = () => [...element.querySelectorAll<HTMLElement>(':scope > [aria-hidden="true"]')]

    // the rows overflow the container, only the end spacer is drawn
    await waitFor(() => expect(getSpacers()).toHaveLength(1))
    await expectSpacersToKeepTheirSize(getSpacers(), horizontal)

    // scroll well past the overscan, both spacers are drawn
    const offset = 100 * Number(args.estimateSize)
    element.scrollTo(horizontal ? { left: offset } : { top: offset })
    await waitFor(() => expect(getSpacers()).toHaveLength(2))
    await expect(horizontal ? element.scrollLeft : element.scrollTop).toBeCloseTo(offset, 0)
    await expectSpacersToKeepTheirSize(getSpacers(), horizontal)
}
