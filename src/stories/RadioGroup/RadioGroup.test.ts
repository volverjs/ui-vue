import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/testing-library'
import { getOptionValue } from '@/test/options'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element'
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value'
	)) as HTMLElement
	const radio = element.getElementsByClassName('vv-radio')[0]
	const input = radio.getElementsByTagName('input')[0]
	const hint = element.getElementsByClassName('vv-radio-group__hint')[0]

	// unchecked value
	if (args.uncheckedValue !== undefined) {
		expect(value.innerHTML).toEqual(String(args.uncheckedValue))
	}

	// checked value
	if (
		!args.invalid &&
		!args.disabled &&
		!args.readonly &&
		args.options &&
		args.options.length > 0
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
