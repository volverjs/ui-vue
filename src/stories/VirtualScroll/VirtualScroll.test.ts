import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor, within } from 'storybook/test'
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

/**
 * Each row is as high as its item says, and holds in `data-size` the size the
 * virtualizer gives it: after a reorder the layout must follow the items.
 */
export async function reorderTest(
    { canvasElement }: PlayAttributes = {} as PlayAttributes,
) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('virtual-scroll')
    const getSized = () => [...element.querySelectorAll<HTMLElement>('[data-size]')]
    const expectLayoutToMatchRows = async () => {
        for (const sized of getSized()) {
            const row = sized.closest('li') as HTMLElement
            await expect(row.getBoundingClientRect().height).toBeCloseTo(Number(sized.dataset.size), 0)
        }
    }

    await waitFor(() => expect(getSized().length).toBeGreaterThan(3))
    await waitFor(expectLayoutToMatchRows)

    const moved = getSized()[2].textContent?.trim()
    await userEvent.click(canvas.getByRole('button', { name: 'Move to top' }))
    await waitFor(() => expect(getSized()[0].textContent?.trim()).toBe(moved))
    // right away, with the sizes it had, not after the rows are measured again
    await expectLayoutToMatchRows()
}

export async function changeOptionsTest(
    { canvasElement }: PlayAttributes = {} as PlayAttributes,
) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('virtual-scroll')
    const getRows = () => element.querySelectorAll(':scope > :not([aria-hidden="true"])')
    const getSpacers = () => [...element.querySelectorAll<HTMLElement>(':scope > [aria-hidden="true"]')]

    // fewer rows are drawn past the viewport
    await waitFor(() => expect(getRows().length).toBeGreaterThan(10))
    const rows = getRows().length
    await userEvent.click(canvas.getByRole('button', { name: 'No overscan' }))
    await waitFor(() => expect(getRows().length).toBeLessThan(rows))

    // the virtualizer follows the scroll along the new axis
    await userEvent.click(canvas.getByRole('button', { name: 'Horizontal' }))
    await waitFor(() => expect(element.scrollWidth).toBeGreaterThan(element.clientWidth))
    element.scrollTo({ left: 100 * 144 })
    await waitFor(() => expect(getSpacers()).toHaveLength(2))
    await expectSpacersToKeepTheirSize(getSpacers(), true)
}

/**
 * The state of a row, here the text typed in its input, follows its item when
 * the items change order.
 */
export async function rowStateTest(
    { canvasElement }: PlayAttributes = {} as PlayAttributes,
) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('virtual-scroll')

    await userEvent.type(await canvas.findByRole('textbox', { name: 'Note on Item 3' }), 'Moved')
    await userEvent.click(canvas.getByRole('button', { name: 'Move to top' }))
    await waitFor(() => expect(element.querySelector('li')).toHaveTextContent('Item 3'))
    await expect(canvas.getByRole('textbox', { name: 'Note on Item 3' })).toHaveValue('Moved')
    await expect(canvas.getByRole('textbox', { name: 'Note on Item 1' })).toHaveValue('')

    await expect(element).toHaveNoViolations()
}
