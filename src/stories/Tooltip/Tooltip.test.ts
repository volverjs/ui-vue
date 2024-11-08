import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/test'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const parentElement = await within(canvasElement).findByTestId('parent')
    const element = parentElement.firstElementChild as HTMLSpanElement

    if (args.default) {
        // slot default
        await expect(element.textContent).toEqual(args.default)
    }
    else if (args.value) {
        // value
        await expect(element.textContent).toEqual(args.value)
    }

    // check if tooltip is visible after focus
    parentElement.focus({
        preventScroll: true,
    })
    await sleep(1200)
    await expect(window.getComputedStyle(element)).toHaveProperty(
        'opacity',
        '1',
    )

    // check accessibility
    await expect(element).toHaveNoViolations()

    // check if tooltip is not visible after blur
    parentElement.blur()
    await sleep(1200)
    await expect(window.getComputedStyle(element)).toHaveProperty(
        'opacity',
        '0',
    )

    // position right
    if (args.position === 'right') {
        await expect(element).toHaveClass('vv-tooltip--right')
    }

    // position left
    if (args.position === 'left') {
        await expect(element).toHaveClass('vv-tooltip--left')
    }

    // position top
    if (args.position === 'top') {
        await expect(element).toHaveClass('vv-tooltip--top')
    }

    // position bottom
    if (args.position === 'bottom') {
        await expect(element).toHaveClass('vv-tooltip--bottom')
    }
}
