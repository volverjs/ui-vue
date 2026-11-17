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

/**
 * Opens the dropdown where its items fit, to measure them, then moves the
 * trigger so that the room below it is `extra` pixels more than their height:
 * not enough once the padding of `size` and the offset are counted
 */
export function roomBelowTest(extra: number) {
    return async ({ canvasElement }: PlayAttributes) => {
        const canvas = within(canvasElement)
        const wrapper = await canvas.findByTestId('wrapper')
        const trigger = await canvas.findByTestId('trigger')
        const dropdown = getDropdown(wrapper) as HTMLElement

        await userEvent.click(trigger)
        await waitFor(() => expectBelow(dropdown, trigger))
        await expectNotSquashed(dropdown)
        const height = dropdown.offsetHeight
        await userEvent.click(trigger)
        await waitFor(() => expect(dropdown).not.toBeVisible())

        wrapper.style.top = 'auto'
        wrapper.style.bottom = `${height + extra}px`
        await userEvent.click(trigger)
        await waitFor(() => expectAbove(dropdown, trigger))
        await expectNotSquashed(dropdown)
    }
}

export async function triggerWidthAfterResizeTest({
    canvasElement,
}: PlayAttributes) {
    const canvas = within(canvasElement)
    const sidebar = await canvas.findByTestId('sidebar')
    const trigger = await canvas.findByTestId('trigger')
    const dropdown = getDropdown(sidebar) as HTMLElement
    // as wide as the trigger and below its start, both at once: the width is
    // written within a pass, before the coordinates
    const expectPlaced = (width: number) =>
        waitFor(async () => {
            const triggerRect = trigger.getBoundingClientRect()
            const dropdownRect = dropdown.getBoundingClientRect()
            await expect(triggerRect.width).toBeCloseTo(width, 0)
            await expect(dropdownRect.width).toBeCloseTo(width, 0)
            await expect(dropdownRect.left).toBeCloseTo(triggerRect.left, 0)
            await expect(dropdownRect.top).toBeCloseTo(triggerRect.bottom, 0)
        })

    // opened with the sidebar closed, as wide as the trigger
    await userEvent.click(trigger)
    await expectPlaced(63)

    // the sidebar opens, and the click closes the dropdown
    await userEvent.click(canvas.getByTestId('sidebar-toggle'))
    await waitFor(() => expect(dropdown).not.toBeVisible())

    // opened again at the same place, since the trigger starts where it did:
    // nothing but the trigger tells that the width has changed
    await userEvent.click(trigger)
    await expectPlaced(235)

    // the trigger changes width while the dropdown is open
    sidebar.style.width = '160px'
    await expectPlaced(160)
    await expect(dropdown).toHaveNoViolations()
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

export async function expandEventsTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId('trigger')
    const events = await canvas.findByTestId('events')

    await userEvent.click(trigger)
    await waitFor(() =>
        expect(events).toHaveTextContent(/^beforeExpand afterExpand$/),
    )
    await userEvent.click(trigger)
    await waitFor(() =>
        expect(events).toHaveTextContent(
            /^beforeExpand afterExpand beforeCollapse afterCollapse$/,
        ),
    )
}

export async function sizeApplyTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId('trigger')
    const room = await canvas.findByTestId('room')

    // the "apply" passed in "size" runs along with the one of the dropdown
    await userEvent.click(trigger)
    await waitFor(() => expect(room).toHaveTextContent(/^\d+$/))
}

/**
 * Opened from the trigger, the first item takes the focus, the arrows move it
 * through the items and Escape closes the dropdown and gives it back to the
 * trigger. `root` holds the dropdown: the document, or the shadow root of a
 * custom element, where the focused item is the root's `activeElement` and
 * the document's is the host.
 */
async function keyboardNavigation(
    root: Document | ShadowRoot,
    scope: ParentNode,
    trigger: HTMLElement,
    axeTarget: () => Element | null,
) {
    const items = () => [
        ...scope.querySelectorAll<HTMLElement>('.vv-dropdown-action'),
    ]
    await userEvent.click(trigger)
    await waitFor(() => expect(root.activeElement).toBe(items()[0]))
    await expect(axeTarget()).toHaveNoViolations()

    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(root.activeElement).toBe(items()[1]))
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(root.activeElement).toBe(items()[2]))
    await userEvent.keyboard('{ArrowUp}')
    await waitFor(() => expect(root.activeElement).toBe(items()[1]))

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(items()[0]).not.toBeVisible())
    await waitFor(() => expect(root.activeElement).toBe(trigger))
}

export async function keyboardNavigationTest({
    canvasElement,
}: PlayAttributes) {
    const trigger = await within(canvasElement).findByTestId('trigger')
    await keyboardNavigation(document, canvasElement, trigger, () =>
        canvasElement.querySelector('.vv-dropdown'))
}

export async function shadowRootTest({ canvasElement }: PlayAttributes) {
    const host = await within(canvasElement).findByTestId('host')
    const trigger = await waitFor(() => {
        const element = host.shadowRoot?.querySelector<HTMLElement>(
            '[data-testid="trigger"]',
        )
        expect(element).toBeTruthy()
        return element as HTMLElement
    })
    const root = host.shadowRoot as ShadowRoot
    // axe runs on the host: on an element inside the shadow root it reports
    // the content as outside any landmark
    await keyboardNavigation(root, root, trigger, () => host)
}

/**
 * A reference that wraps its trigger with a hidden input before it, as a
 * form field does: Escape gives the focus to the trigger, not to the input.
 */
export async function wrapperReferenceTest({ canvasElement }: PlayAttributes) {
    const trigger = await within(canvasElement).findByTestId('trigger')
    const items = () => [
        ...canvasElement.querySelectorAll<HTMLElement>('.vv-dropdown-action'),
    ]
    await userEvent.click(trigger)
    await waitFor(() => expect(document.activeElement).toBe(items()[0]))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(items()[0]).not.toBeVisible())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
}

/**
 * Enter on the item that opens a nested dropdown opens it, the arrows there
 * move one item, Escape closes the nested dropdown alone and gives the focus
 * back to its item, and a second Escape closes the outer one and gives the
 * focus back to its trigger, whichever dropdown hears the key first.
 */
export async function nestedKeyboardTest({ canvasElement }: PlayAttributes) {
    const trigger = await within(canvasElement).findByTestId('trigger')
    const action = (label: string) =>
        [
            ...canvasElement.querySelectorAll<HTMLElement>(
                '.vv-dropdown-action',
            ),
        ].find(element => element.textContent?.trim() === label)

    await userEvent.click(trigger)
    await waitFor(() => expect(document.activeElement).toBe(action('Update')))
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await waitFor(() => expect(document.activeElement).toBe(action('More')))
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(document.activeElement).toBe(action('Create')))
    await expect(canvasElement.querySelector('.vv-dropdown')).toHaveNoViolations()
    await userEvent.keyboard('{ArrowDown}')
    await sleep(100)
    await expect(document.activeElement).toBe(action('Publish'))

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(action('Create')).not.toBeVisible())
    await waitFor(() => expect(document.activeElement).toBe(action('More')))
    await expect(action('Update')).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(action('Update')).not.toBeVisible())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
}

/**
 * Enter and Space run the focused item once: an action, a button the browser
 * activates by itself, and an option, which the dropdown clicks. The action
 * closes the dropdown and gives the focus back to the trigger; the option
 * leaves it open. `root` holds the dropdown and the counts, as in
 * `keyboardNavigation`.
 */
async function enterOnItem(root: Document | ShadowRoot, scope: ParentNode) {
    const trigger = scope.querySelector<HTMLElement>(
        '[data-testid="trigger"]',
    ) as HTMLElement
    const count = () =>
        scope.querySelector('[data-testid="count"]')?.textContent?.trim()
    const action = scope.querySelector<HTMLElement>('.vv-dropdown-action')
    const option = scope.querySelector<HTMLElement>('.vv-dropdown-option')
    await expect(count()).toBe('0 0')

    // each count after a pause, so that a second run after a render shows
    await userEvent.click(trigger)
    await waitFor(() => expect(root.activeElement).toBe(action))
    await userEvent.keyboard('{Enter}')
    await sleep(100)
    await expect(count()).toBe('1 0')
    await waitFor(() => expect(action).not.toBeVisible())
    await waitFor(() => expect(root.activeElement).toBe(trigger))

    await userEvent.click(trigger)
    await waitFor(() => expect(root.activeElement).toBe(action))
    await userEvent.keyboard(' ')
    await sleep(100)
    await expect(count()).toBe('2 0')
    await waitFor(() => expect(action).not.toBeVisible())
    await waitFor(() => expect(root.activeElement).toBe(trigger))

    // the option is focused directly, so that the arrows have no part in it
    await userEvent.click(trigger)
    await waitFor(() => expect(root.activeElement).toBe(action))
    option?.focus()
    await waitFor(() => expect(root.activeElement).toBe(option))
    await userEvent.keyboard('{Enter}')
    await sleep(100)
    await expect(count()).toBe('2 1')
    await userEvent.keyboard(' ')
    await sleep(100)
    await expect(count()).toBe('2 2')
    await expect(option).toBeVisible()
}

export async function enterOnItemTest({ canvasElement }: PlayAttributes) {
    await within(canvasElement).findByTestId('trigger')
    await enterOnItem(document, canvasElement)
}

export async function enterOnItemInShadowRootTest({
    canvasElement,
}: PlayAttributes) {
    const host = await within(canvasElement).findByTestId('host')
    await waitFor(() =>
        expect(host.shadowRoot?.querySelector('[data-testid="trigger"]')).toBeTruthy(),
    )
    const root = host.shadowRoot as ShadowRoot
    await enterOnItem(root, root)
}

/**
 * A click on an action runs it once, closes the dropdown and gives the focus
 * back to the trigger; with `keepOpen` the dropdown stays open.
 */
export function actionClickTest(keepOpen: boolean) {
    return async ({ canvasElement }: PlayAttributes) => {
        const canvas = within(canvasElement)
        const trigger = await canvas.findByTestId('trigger')
        const count = () => canvas.getByTestId('count').textContent?.trim()
        const action = () =>
            canvasElement.querySelector<HTMLElement>('.vv-dropdown-action')
        await userEvent.click(trigger)
        await waitFor(() => expect(action()).toBeVisible())
        await expect(
            canvasElement.querySelector('.vv-dropdown'),
        ).toHaveNoViolations()
        await userEvent.click(action() as HTMLElement)
        await sleep(100)
        await expect(count()).toBe('1')
        if (keepOpen) {
            await expect(action()).toBeVisible()
            return
        }
        await waitFor(() => expect(action()).not.toBeVisible())
        await waitFor(() => expect(document.activeElement).toBe(trigger))
    }
}

/**
 * A click on the item that opens a nested dropdown opens it and leaves the
 * outer one open; a click on an item of the nested one closes both and gives
 * the focus back to the trigger.
 */
export async function nestedClickTest({ canvasElement }: PlayAttributes) {
    const trigger = await within(canvasElement).findByTestId('trigger')
    const action = (label: string) =>
        [
            ...canvasElement.querySelectorAll<HTMLElement>(
                '.vv-dropdown-action',
            ),
        ].find(element => element.textContent?.trim() === label) as HTMLElement

    await userEvent.click(trigger)
    await waitFor(() => expect(action('More')).toBeVisible())
    await userEvent.click(action('More'))
    await waitFor(() => expect(action('Create')).toBeVisible())
    await expect(action('Update')).toBeVisible()
    await expect(canvasElement.querySelector('.vv-dropdown')).toHaveNoViolations()

    await userEvent.click(action('Create'))
    await waitFor(() => expect(action('Create')).not.toBeVisible())
    await waitFor(() => expect(action('Update')).not.toBeVisible())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
}

/**
 * A dropdown placed inside an item of a menu: a click on a button in its
 * `after` slot leaves the menu open, since only an item of a dropdown closes
 * it.
 */
export async function nestedInItemTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByTestId('trigger')
    const update = () =>
        [
            ...canvasElement.querySelectorAll<HTMLElement>(
                '.vv-dropdown-action',
            ),
        ].find(element => element.textContent?.trim() === 'Update') as HTMLElement

    await userEvent.click(trigger)
    await waitFor(() => expect(update()).toBeVisible())
    await expect(canvasElement.querySelector('.vv-dropdown')).toHaveNoViolations()
    await userEvent.click(canvas.getByTestId('nested-trigger'))
    const done = canvas.getByTestId('done')
    await waitFor(() => expect(done).toBeVisible())

    await userEvent.click(done)
    await sleep(100)
    await expect(done).toBeVisible()
    await expect(update()).toBeVisible()
}
