import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value',
	)) as HTMLElement
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

	// check accessibility
	await expect(element).toHaveNoViolations()
}
