import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const input = element.getElementsByTagName('input')[0]
    const hint = element.getElementsByClassName('vv-checkbox__hint')[0]

    // unchecked value
    if (args.uncheckedValue !== undefined) {
        expect(value.innerHTML).toEqual(String(args.uncheckedValue))
    }

    // checked value
    if (!args.invalid && !args.indeterminate) {
        element.addEventListener('click', async () => {
            await sleep()
            if (!args.disabled && !args.readonly) {
                expect(value.innerHTML).toEqual(String(args.value))
            }
        })
        if (args.disabled || args.readonly) {
            await expect(input).not.toBeChecked()
        } else {
            await expect(input).toBeChecked()
        }
    }

    // disabled
    if (args.disabled) {
        await expect(element).toHaveClass('vv-checkbox--disabled')
        await expect(input).toHaveProperty('disabled')
        await expect(input).not.toBeChecked()
    }

    // readonly
    if (args.readonly) {
        await expect(element).toHaveClass('vv-checkbox--readonly')
        await expect(input).toHaveProperty('disabled')
        await expect(input).not.toBeChecked()
    }

    // indeterminate
    if (args.indeterminate) {
        await expect(element).toHaveClass('vv-checkbox--indeterminate')
        await expect(input).toHaveProperty('indeterminate')
    }

    // invalid
    if (args.invalid) {
        await expect(element).toHaveClass('vv-checkbox--invalid')
        await expect(input).toHaveProperty('ariaInvalid')
        if (args.invalidLabel) {
            await expect(hint.innerHTML).toEqual(args.invalidLabel)
        }
    }

    // valid
    if (args.valid) {
        await expect(element).toHaveClass('vv-checkbox--valid')
        await expect(input).toHaveProperty('ariaInvalid', 'false')
        if (args.validLabel) {
            await expect(hint.innerHTML).toEqual(args.validLabel)
        }
    }

    // hint
    if (args.hintLabel) {
        await expect(hint.innerHTML).toEqual(args.hintLabel)
    }

    // The label has an element of its own, which the `label` element of
    // `vv-checkbox` in @volverjs/style dresses with `flex: 1` and `min-width: 0`.
    // Without either half a label longer than the control is an anonymous flex
    // item whose max-content width does not fit, so it starts a new flex line
    // and drops below the box: this is what a component released ahead of its
    // style looks like from here.
    const label = element.getElementsByClassName('vv-checkbox__label')[0]
    await expect(label).toBeInTheDocument()
    await expect(getComputedStyle(label).flexGrow).toEqual('1')
    await expect(getComputedStyle(label).minWidth).toEqual('0px')

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function longLabelTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const input = element.getElementsByTagName('input')[0]
    const label = element.getElementsByClassName('vv-checkbox__label')[0]

    const inputRect = input.getBoundingClientRect()
    const labelRect = label.getBoundingClientRect()
    const lineHeight = Number.parseFloat(getComputedStyle(label).lineHeight)

    // The story constrains the field so that the label has to wrap. Without
    // more than one line the case this story exists for is not being drawn,
    // and everything below it would hold on a label that never wrapped.
    await expect(lineHeight).toBeGreaterThan(0)
    await expect(labelRect.height).toBeGreaterThan(lineHeight * 1.5)

    // It wraps as text beside the control and not as a block under it. As an
    // anonymous text node it was a flex item whose max-content width did not
    // fit, so it started a new flex line and took the full width, leaving the
    // control alone on the row above.
    await expect(labelRect.left).toBeGreaterThanOrEqual(inputRect.right)

    // And the control belongs to the first line of that label, not to the
    // centre of the whole block, which is where it sat before: 22px lower.
    const firstLineCentre = labelRect.top + lineHeight / 2
    const controlCentre = inputRect.top + inputRect.height / 2
    await expect(Math.abs(controlCentre - firstLineCentre)).toBeLessThan(2)
}
