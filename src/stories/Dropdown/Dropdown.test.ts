import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement }: PlayAttributes) {
    const wrapper = await within(canvasElement).findByTestId('wrapper')
    const trigger = await within(canvasElement).findByTestId('trigger')

    await expect(trigger).toBeClicked()
    await sleep(100)
    const dropdown = wrapper.getElementsByClassName('vv-dropdown')[0]
    await expect(dropdown).toBeDefined()

    // check accessibility
    await expect(dropdown).toHaveNoViolations()
}

function getDropdown(wrapper: HTMLElement) {
    return wrapper.getElementsByClassName('vv-dropdown')[0]
}

/**
 * The dropdown is in the top layer: it is positioned against the viewport, it
 * overlaps a bar that declares a higher z-index in an outer stacking context,
 * and it is painted above it anyway
 */
async function expectAboveTheBar(
    canvasElement: HTMLElement,
    dropdown: Element,
) {
    await expect(dropdown.matches(':popover-open')).toBe(true)
    await expect(globalThis.getComputedStyle(dropdown).position).toBe('fixed')

    const bar = await within(canvasElement).findByTestId('bar')
    const barRect = bar.getBoundingClientRect()
    const dropdownRect = dropdown.getBoundingClientRect()
    await expect(dropdownRect.top).toBeLessThan(barRect.bottom)
    await expect(dropdownRect.bottom).toBeGreaterThan(barRect.top)

    const overlapY
        = (Math.max(dropdownRect.top, barRect.top)
            + Math.min(dropdownRect.bottom, barRect.bottom)) / 2
    await expect(
        document
            .elementFromPoint(dropdownRect.left + 4, overlapY)
            ?.closest('.vv-dropdown'),
    ).toBe(dropdown)
}

export async function idClearedTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId('trigger')
    const list = () =>
        canvasElement.getElementsByClassName(
            'vv-dropdown__list',
        )[0] as HTMLElement
    expect(list().id).toBe('menu')
    expect(trigger.getAttribute('aria-controls')).toBe('menu')

    // without an id the dropdown falls back to one of its own
    expect(await canvas.findByTestId('clear')).toBeClicked()
    await sleep()
    expect(list().id).not.toBe('')
    expect(trigger.getAttribute('aria-controls')).toBe(list().id)
}

export async function topLayerTest({ canvasElement }: PlayAttributes) {
    const wrapper = await within(canvasElement).findByTestId('wrapper')
    const trigger = await within(canvasElement).findByTestId('trigger')
    const dropdown = getDropdown(wrapper)

    await expect(dropdown).toBeDefined()
    // "manual" popover: no light dismiss, the component keeps its own click
    // outside handling
    await expect(dropdown.getAttribute('popover')).toBe('manual')
    await expect(dropdown.matches(':popover-open')).toBe(false)

    await expect(trigger).toBeClicked()
    await sleep(100)

    await expectAboveTheBar(canvasElement, dropdown)
    await expect(dropdown).toHaveNoViolations()
}

export async function topLayerExpandedOnMountTest({
    canvasElement,
}: PlayAttributes) {
    const wrapper = await within(canvasElement).findByTestId('wrapper')

    // wait for the first placement computed by floating-ui
    await sleep(100)

    // expanded through the model, so the promotion happens on mount without any
    // interaction
    await expectAboveTheBar(canvasElement, getDropdown(wrapper))
}

function getList(dropdown: Element) {
    return dropdown.getElementsByClassName('vv-dropdown__list')[0] as HTMLElement
}

/**
 * The list scrolls inside the dropdown, so a dropdown capped below the height
 * of its items shows on the list: the dropdown itself never overflows
 */
async function expectNotSquashed(dropdown: Element) {
    const list = getList(dropdown)
    await expect(list.scrollHeight).toBeLessThanOrEqual(list.clientHeight + 1)
}

async function expectAbove(dropdown: Element, trigger: Element) {
    await expect(dropdown.getBoundingClientRect().bottom).toBeLessThanOrEqual(
        trigger.getBoundingClientRect().top + 0.5,
    )
}

async function expectBelow(dropdown: Element, trigger: Element) {
    await expect(dropdown.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        trigger.getBoundingClientRect().bottom - 0.5,
    )
}

export async function flipNearViewportBottomTest({
    canvasElement,
}: PlayAttributes) {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId('trigger')
    const dropdown = getDropdown(await canvas.findByTestId('wrapper'))

    // let floating-ui place the collapsed dropdown first: measured 0px tall,
    // "size" used to cap the next opening to the room left below the trigger
    await sleep(200)
    await userEvent.click(trigger)

    // the dropdown moves above the trigger and is not squashed
    await waitFor(() => expectAbove(dropdown, trigger))
    await expectNotSquashed(dropdown)
    await expect(dropdown).toHaveNoViolations()
}

export async function reopenAfterResizeTest({
    canvasElement,
}: PlayAttributes) {
    const canvas = within(canvasElement)
    const container = await canvas.findByTestId('container')
    const anchor = await canvas.findByTestId('anchor')
    const trigger = await canvas.findByTestId('trigger')
    const dropdown = getDropdown(container) as HTMLElement
    const list = getList(dropdown)

    // no room for the list on either side: it opens below, capped
    await userEvent.click(trigger)
    await waitFor(() =>
        expect(list.scrollHeight).toBeGreaterThan(list.clientHeight + 1),
    )
    const capped = dropdown.offsetHeight
    const natural = capped - list.clientHeight + list.scrollHeight
    await userEvent.click(trigger)
    await waitFor(() => expect(dropdown).not.toBeVisible())

    // the container grows: room above for the whole list, and room below for
    // more than the old cap but not for the list
    container.style.height = '600px'
    const below = (capped + natural) / 2 + 10
    anchor.style.top = `${600 - trigger.offsetHeight - below}px`

    // the old cap is not measured as the height of the list
    await userEvent.click(trigger)
    await waitFor(() => expectAbove(dropdown, trigger))
    await expectNotSquashed(dropdown)
}

export async function noResizeObserverLoopTest({
    canvasElement,
}: PlayAttributes) {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId('trigger')
    const dropdown = getDropdown(await canvas.findByTestId('wrapper'))
    const list = getList(dropdown)

    // a list taller than the room on either side, opened three times: its cap
    // is set before the ResizeObserver reports the new size, not in reply
    const errors: string[] = []
    const onError = (event: ErrorEvent) => errors.push(event.message)
    globalThis.addEventListener('error', onError)
    try {
        for (let i = 0; i < 3; i++) {
            await userEvent.click(trigger)
            await waitFor(() =>
                expect(list.scrollHeight).toBeGreaterThan(list.clientHeight + 1),
            )
            await sleep(100)
            await userEvent.click(trigger)
            await waitFor(() => expect(dropdown).not.toBeVisible())
        }
    } finally {
        globalThis.removeEventListener('error', onError)
    }
    await expect(errors).toEqual([])
}

export async function contentChangesWhileOpenTest({
    canvasElement,
}: PlayAttributes) {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId('trigger')
    const dropdown = getDropdown(await canvas.findByTestId('wrapper'))
    const list = getList(dropdown)
    const show = (count: number) =>
        userEvent.click(canvas.getByRole('button', { name: `${count} actions` }))

    // one action fits below the trigger
    await userEvent.click(trigger)
    await waitFor(() => expectBelow(dropdown, trigger))

    // ten do not: the dropdown grows to its cap and moves above
    await show(10)
    await waitFor(() => expectAbove(dropdown, trigger))
    await expectNotSquashed(dropdown)

    // forty fit on neither side: capped below, as the placement asks
    await show(40)
    await waitFor(async () => {
        await expectBelow(dropdown, trigger)
        await expect(list.scrollHeight).toBeGreaterThan(list.clientHeight + 1)
    })
    // let the ResizeObserver report the move, which places the dropdown again
    await sleep(200)

    // six fit above, while the capped dropdown keeps its size: nothing but the
    // items tells that it has to move
    await show(6)
    await waitFor(() => expectAbove(dropdown, trigger))
    await expectNotSquashed(dropdown)
}

export async function contextmenuRerenderTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const target = await canvas.findByTestId('target')
    const rerender = canvas.getByTestId('rerender')
    const list = () =>
        canvasElement.getElementsByClassName('vv-dropdown__list')[0] as HTMLElement

    // bound once the dropdown ref is filled: a right click opens the menu
    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 20, clientY: 20 }))
    await waitFor(() => expect(list()).toBeVisible())
    await userEvent.keyboard('{Escape}')

    // count the listeners each later render of the host adds and removes
    let listeners = 0
    const add = target.addEventListener.bind(target)
    const remove = target.removeEventListener.bind(target)
    target.addEventListener = ((type: string, ...rest: [EventListener]) => {
        listeners += type === 'contextmenu' ? 1 : 0
        return add(type, ...rest)
    }) as typeof target.addEventListener
    target.removeEventListener = ((type: string, ...rest: [EventListener]) => {
        listeners -= type === 'contextmenu' ? 1 : 0
        return remove(type, ...rest)
    }) as typeof target.removeEventListener
    for (let render = 0; render < 3; render++) {
        await userEvent.click(rerender)
        await sleep()
    }

    // the same dropdown stays bound as it was: every render used to add one
    // more listener and keep the others
    await expect(rerender).toHaveTextContent('3')
    await expect(listeners).toBe(0)

    // with the dropdown removed nothing is left listening for it, and drawn
    // again it is bound once more, and only once
    const toggle = canvas.getByTestId('toggle')
    await userEvent.click(toggle)
    await waitFor(() => expect(listeners).toBe(-1))
    await userEvent.click(toggle)
    await waitFor(() => expect(listeners).toBe(0))
    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 20, clientY: 20 }))
    await waitFor(() => expect(list()).toBeVisible())
}
