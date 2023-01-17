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
	const hint = element.getElementsByClassName('vv-radio__hint')[0]

	// click
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
		await expect(element).toHaveClass('vv-radio--disabled')
		await expect(input).toHaveProperty('disabled')
		await expect(input).not.toBeChecked()
	}

	// readonly
	if (args.readonly) {
		await expect(element).toHaveClass('vv-radio--readonly')
		await expect(input).toHaveProperty('disabled')
		await expect(input).not.toBeChecked()
	}

	// invalid
	if (args.invalid) {
		await expect(element).toHaveClass('vv-radio--invalid')
		await expect(input).toHaveProperty('ariaInvalid')
		if (args.invalidLabel) {
			await expect(hint.innerHTML).toEqual(args.invalidLabel)
		}
	}

	// valid
	if (args.valid) {
		await expect(element).toHaveClass('vv-radio--valid')
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
