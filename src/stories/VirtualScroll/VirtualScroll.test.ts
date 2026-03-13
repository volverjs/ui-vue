import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
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
