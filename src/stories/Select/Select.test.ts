import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const select = element.getElementsByTagName('select')[0]
    const hint = element.getElementsByClassName('vv-select__hint')[0]

    const { getOptionValue } = useOptions(args)

    if (
        !args.invalid
        && !args.disabled
        && !args.readonly
        && args.options
        && args.options.length > 0
    ) {
        // select first value
        const firstValue = getOptionValue(
            args.options[0].options?.[0] ?? args.options[0],
        )
        if (!args.autoselectFirst) {
            select.value = firstValue
            select.dispatchEvent(new Event('change'))
            await sleep()
        }
        if (args.multiple) {
            await expect(JSON.parse(value.innerHTML)).toEqual([firstValue])
        } else {
            await expect(value.innerHTML).toEqual(firstValue)
        }
    }

    // disabled
    if (args.disabled) {
        await expect(element).toHaveClass('vv-select--disabled')
        await expect(select).toHaveProperty('disabled')
        await expect(select).not.toBeClicked()
    }

    // readonly
    if (args.readonly) {
        await expect(element).toHaveClass('vv-select--readonly')
        await expect(select).toHaveProperty('disabled')
        await expect(select).not.toBeClicked()
    }

    // invalid
    if (args.invalid) {
        await expect(element).toHaveClass('vv-select--invalid')
        await expect(select).toHaveProperty('ariaInvalid')
        if (args.invalidLabel) {
            await expect(hint.innerHTML).toEqual(args.invalidLabel)
        }
    }

    // valid
    if (args.valid) {
        await expect(element).toHaveClass('vv-select--valid')
        await expect(select).toHaveProperty('ariaInvalid', 'false')
        if (args.validLabel) {
            await expect(hint.innerHTML).toEqual(args.validLabel)
        }
    }

    // loading
    if (args.loading) {
        await expect(element).toHaveClass('vv-select--loading')
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
    const select = element.getElementsByTagName('select')[0]

    // `label` is optional, so a select can be drawn with no <label> to be
    // associated with. The name then comes from `aria-label`, and it has to sit
    // on the control: on the block it would name a wrapper the user never
    // reaches. Declaring it as a prop is what takes it out of `$attrs`, which is
    // why the block does not carry a copy.
    await expect(element).not.toHaveAttribute('aria-label')
    await expect(select).toHaveAttribute('aria-label', 'Reparto')
    await expect(element.querySelector('label')).toBeNull()
    await expect(element).toHaveNoViolations()
}

export async function ariaDescribedbyTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const select = element.getElementsByTagName('select')[0]
    const hint = element.getElementsByClassName('vv-select__hint')[0]

    // `aria-describedby` is a list of ids, so the hint joins what the caller
    // pointed at rather than taking its place. This is also the path the native
    // VvCombobox takes, which hands its own `ariaDescribedby` straight down.
    const describedBy = select.getAttribute('aria-describedby')?.split(' ') ?? []
    await expect(describedBy).toContain('extra-help')
    await expect(describedBy).toContain(hint.id)
    await expect(element).not.toHaveAttribute('aria-describedby')
    await expect(element).toHaveNoViolations()
}
