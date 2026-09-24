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
}
