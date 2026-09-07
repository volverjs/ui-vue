import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const value = await canvas.findByTestId('value')
    const input = element.getElementsByTagName('input')[0]
    const readout = element.getElementsByClassName('vv-input-range__value')[0]
    const hint = element.getElementsByClassName('vv-input-range__hint')[0]

    await expect(input).toHaveAttribute('type', 'range')
    await expect(Boolean(readout)).toEqual(Boolean(args.showValue))

    // An attribute the component does not declare stays on the block, which is
    // what the page addresses, while the `aria-` ones name the control.
    await expect(element).toHaveClass('vv-input-range')
    await expect(element.tagName).toEqual('DIV')

    // The field reports the middle of its track until it has a value, and the
    // fill, the readout and the model have to say the same.
    await expect(value.innerHTML).toEqual('50')
    if (args.showValue) {
        await expect(readout.textContent?.trim()).toContain('50')
    }
    await expect(
        element.style.getPropertyValue('--input-range-progress'),
    ).toEqual('50%')

    // value
    if (!args.disabled && !args.readonly) {
        input.value = '75'
        input.dispatchEvent(new Event('input', { bubbles: true }))
        await sleep()
        await expect(value.innerHTML).toEqual('75')
        if (args.showValue) {
            await expect(readout.textContent?.trim()).toContain('75')
        }
        await expect(
            element.style.getPropertyValue('--input-range-progress'),
        ).toEqual('75%')
    }

    // disabled
    if (args.disabled) {
        await expect(element).toHaveClass('vv-input-range--disabled')
        await expect(input.disabled).toEqual(true)
    }

    // readonly
    // A range takes no readonly attribute: the native control is disabled and
    // the modifier is what keeps it from looking disabled.
    if (args.readonly) {
        await expect(element).toHaveClass('vv-input-range--readonly')
        await expect(element).not.toHaveClass('vv-input-range--disabled')
        await expect(input.disabled).toEqual(true)
        await expect(input).toHaveAttribute('tabindex', '-1')
    }

    // invalid
    if (args.invalid) {
        await expect(element).toHaveClass('vv-input-range--invalid')
        await expect(input).toHaveAttribute('aria-invalid', 'true')
        if (args.invalidLabel) {
            await expect(hint.innerHTML).toEqual(args.invalidLabel)
        }
    }

    // valid
    if (args.valid) {
        await expect(element).toHaveClass('vv-input-range--valid')
        await expect(input).toHaveAttribute('aria-invalid', 'false')
        if (args.validLabel) {
            await expect(hint.innerHTML).toEqual(args.validLabel)
        }
    }

    // loading
    if (args.loading) {
        await expect(element).toHaveClass('vv-input-range--loading')
    }

    // unit
    if (args.unit && args.showValue) {
        const unit = element.getElementsByClassName('vv-input-range__unit')[0]
        await expect(unit.textContent?.trim()).toEqual(args.unit)
    }

    // hint
    if (args.hintLabel) {
        await expect(hint.innerHTML).toEqual(args.hintLabel)
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function ariaLabelTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const input = element.getElementsByTagName('input')[0]

    // Without a visible label the field is named by its `aria-label`, and the
    // name has to sit on the control: on the block it would name a wrapper the
    // user never reaches.
    await expect(element).not.toHaveAttribute('aria-label')
    await expect(input).toHaveAttribute('aria-label', 'Volume')

    // With no hint of its own the field has nothing to add, so the reference
    // the caller passed reaches the control untouched.
    await expect(input).toHaveAttribute('aria-describedby', 'extra-help')
    await expect(element).toHaveNoViolations()
}

export async function ariaDescribedbyTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const input = element.getElementsByTagName('input')[0]
    const hint = element.getElementsByClassName('vv-input-range__hint')[0]

    // `aria-describedby` is a list of ids, so the hint joins what the caller
    // pointed at rather than taking its place.
    const describedBy
        = input.getAttribute('aria-describedby')?.split(' ') ?? []
    await expect(describedBy).toContain('extra-help')
    await expect(describedBy).toContain(hint.id)
    await expect(element).toHaveNoViolations()
}

export async function tinyStepTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const value = await canvas.findByTestId('value')
    const readout = element.getElementsByClassName('vv-input-range__value')[0]

    // A step below 1e-6 stringifies in exponent form, where its decimals live
    // in the exponent: read as text alone the step looks like an integer and
    // the middle of this track rounds to zero.
    await expect(value.innerHTML).toEqual('5e-7')
    await expect(readout.textContent?.trim()).toContain('5e-7')
}

export async function debouncedTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const value = await canvas.findByTestId('value')
    const input = element.getElementsByTagName('input')[0]
    const readout = element.getElementsByClassName('vv-input-range__value')[0]

    // The field has no empty state: the middle of the track reaches the model
    // on mount, before anything is dragged.
    await expect(value.innerHTML).toEqual('50')

    // The debounce (300ms) holds the value back, but the readout and the fill
    // follow the slider right away.
    input.value = '80'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await sleep(50)
    await expect(value.innerHTML).toEqual('50')
    await expect(readout.textContent?.trim()).toContain('80')
    await expect(
        element.style.getPropertyValue('--input-range-progress'),
    ).toEqual('80%')

    // Once the timer fires the model catches up.
    await sleep(350)
    await expect(value.innerHTML).toEqual('80')
}
