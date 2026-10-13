import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'
import { getOptionValue } from '@/test/options'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const radio = element.getElementsByClassName('vv-radio')[0]
    const input = radio.getElementsByTagName('input')[0]
    const hint = element.getElementsByClassName('vv-radio-group__hint')[0]

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
        radio.addEventListener('click', async () => {
            await sleep()
            const firstValue = getOptionValue(args, 0)
            expect(value.innerHTML).toEqual(firstValue)
        })
        await expect(input).toBeChecked()
    }

    // disabled
    if (args.disabled) {
        await expect(element).toHaveClass('vv-radio-group--disabled')
        await expect(input).toHaveProperty('disabled')
        await expect(input).not.toBeChecked()
    }

    // readonly
    if (args.readonly) {
        await expect(element).toHaveClass('vv-radio-group--readonly')
        await expect(input).toHaveProperty('disabled')
        await expect(input).not.toBeChecked()
    }

    // vertical
    if (!args.vertical) {
        await expect(element).toHaveClass('vv-radio-group--horizontal')
    }

    // invalid
    if (args.invalid) {
        await expect(element).toHaveClass('vv-radio-group--invalid')
        await expect(input).toHaveProperty('ariaInvalid')
        if (args.invalidLabel) {
            await expect(hint.innerHTML).toEqual(args.invalidLabel)
        }
    }

    // valid
    if (args.valid) {
        await expect(element).toHaveClass('vv-radio-group--valid')
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
    const options = [...element.getElementsByClassName('vv-radio')]
    const inputs = within(element).getAllByRole('radio') as HTMLInputElement[]

    // the track on the group, the tile on every option drawn from `options`
    await expect(element).toHaveClass('vv-radio-group--segmented')
    await expect(options).toHaveLength(3)
    for (const option of options) {
        await expect(option).toHaveClass('vv-radio--segment')
    }

    // the input is not painted, but it is still the control: the arrow keys
    // move the choice
    inputs[0].focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(inputs[1].checked).toBe(true)
    await waitFor(() => expect(value.textContent).toBe('week'))

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function cardsTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const value = await within(canvasElement).findByTestId('value')
    const options = [...element.getElementsByClassName('vv-radio')] as HTMLElement[]

    // the row on the group, the tile on every option
    await expect(element).toHaveClass('vv-radio-group--cards')
    await expect(options).toHaveLength(3)
    for (const option of options) {
        await expect(option).toHaveClass('vv-radio--card')
    }

    // the whole tile is the label of its radio: a click on the description
    // chooses it
    await userEvent.click(within(options[1]).getByText(/^Unlimited agents/))
    await expect(within(options[1]).getByRole<HTMLInputElement>('radio').checked).toBe(true)
    await waitFor(() => expect(value.textContent).toBe('team'))

    // check accessibility
    await expect(element).toHaveNoViolations()
}
