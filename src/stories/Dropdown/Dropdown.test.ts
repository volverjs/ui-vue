import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
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
