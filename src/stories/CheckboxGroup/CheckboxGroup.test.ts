import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'
import { getOptionValue } from '@/test/options'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const checkbox = element.getElementsByClassName('vv-checkbox')[0]
    const input = checkbox.getElementsByTagName('input')[0]
    const hint = element.getElementsByClassName('vv-checkbox-group__hint')[0]

    // unchecked value
    if (args.uncheckedValue !== undefined) {
        expect(value.innerHTML).toEqual(String(args.uncheckedValue))
    }

    // checked value
    if (
        !args.invalid
        && !args.disabled
        && !args.readonly
        && args.options
        && args.options.length > 0
    ) {
        checkbox.addEventListener('click', async () => {
            await sleep()
            const firstValue = getOptionValue(args, 0)
            expect(JSON.parse(value.innerHTML)).toEqual([firstValue])
        })
        await expect(input).toBeChecked()
    }

    // disabled
    if (args.disabled) {
        await expect(element).toHaveClass('vv-checkbox-group--disabled')
        await expect(input).toHaveProperty('disabled')
        await expect(input).not.toBeChecked()
    }

    // readonly
    if (args.readonly) {
        await expect(element).toHaveClass('vv-checkbox-group--readonly')
        await expect(input).toHaveProperty('disabled')
        await expect(input).not.toBeChecked()
    }

    // vertical
    if (!args.vertical) {
        await expect(element).toHaveClass('vv-checkbox-group--horizontal')
    }

    // invalid
    if (args.invalid) {
        await expect(element).toHaveClass('vv-checkbox-group--invalid')
        await expect(input).toHaveProperty('ariaInvalid')
        if (args.invalidLabel) {
            await expect(hint.innerHTML).toEqual(args.invalidLabel)
        }
    }

    // valid
    if (args.valid) {
        await expect(element).toHaveClass('vv-checkbox-group--valid')
        await expect(input).toHaveProperty('ariaInvalid', 'false')
        if (args.validLabel) {
            await expect(hint.innerHTML).toEqual(args.validLabel)
        }
    }

    // hint
    if (args.hintLabel) {
        await expect(hint.innerHTML).toEqual(args.hintLabel)
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function segmentedTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const options = [...element.getElementsByClassName('vv-checkbox')]
    const inputs = within(element).getAllByRole('checkbox') as HTMLInputElement[]

    // the track on the group, the tile on every option drawn from `options`
    await expect(element).toHaveClass('vv-checkbox-group--segmented')
    await expect(options).toHaveLength(3)
    for (const option of options) {
        await expect(option).toHaveClass('vv-checkbox--segment')
    }

    // the input is not painted, but it is still the control: the space bar
    // turns an option on, and more than one can be on
    inputs[1].focus()
    await userEvent.keyboard(' ')
    await expect(inputs[1].checked).toBe(true)
    await expect(inputs[0].checked).toBe(true)
    await waitFor(() => expect(value.textContent).toBe('bold,italic'))

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function cardsTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const options = [...element.getElementsByClassName('vv-checkbox')] as HTMLElement[]

    // the row on the group, the tile on every option
    await expect(element).toHaveClass('vv-checkbox-group--cards')
    await expect(options).toHaveLength(3)
    for (const option of options) {
        await expect(option).toHaveClass('vv-checkbox--card')
    }

    // the whole tile is the label of its checkbox: a click on the
    // description turns it on
    await userEvent.click(within(options[1]).getByText(/^A text message/))
    await expect(within(options[1]).getByRole<HTMLInputElement>('checkbox').checked).toBe(true)
    await waitFor(() => expect(value.textContent).toBe('email,sms'))

    // check accessibility
    await expect(element).toHaveNoViolations()
}
