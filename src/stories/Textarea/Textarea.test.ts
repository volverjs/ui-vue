import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within, userEvent } from '@storybook/test'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value',
	)) as HTMLElement
	const textarea = element.getElementsByTagName('textarea')[0]
	const hint = element.getElementsByClassName('vv-textarea__hint')[0]

	// value
	if (!args.invalid && !args.disabled && !args.readonly) {
		const inputValue = 'Lorem ipsum'
		if (inputValue) {
			await expect(textarea).toBeClicked()
			await userEvent.keyboard(inputValue)
			await sleep()
			if (args.maxlength) {
				await expect(value.innerHTML).toEqual(
					inputValue.slice(0, args.maxlength),
				)
			} else {
				await expect(value.innerHTML).toEqual(inputValue)
			}
		}
	}

	// disabled
	if (args.disabled) {
		await expect(element).toHaveClass('vv-textarea--disabled')
		await expect(textarea).toHaveProperty('disabled')
		await expect(textarea).not.toBeClicked()
	}

	// readonly
	if (args.readonly) {
		await expect(element).toHaveClass('vv-textarea--readonly')
		await expect(textarea).toHaveProperty('readOnly')
	}

	// invalid
	if (args.invalid) {
		await expect(element).toHaveClass('vv-textarea--invalid')
		await expect(textarea).toHaveProperty('ariaInvalid')
		if (args.invalidLabel) {
			await expect(hint.innerHTML).toEqual(args.invalidLabel)
		}
	}

	// valid
	if (args.valid) {
		await expect(element).toHaveClass('vv-textarea--valid')
		await expect(textarea).toHaveProperty('ariaInvalid', 'false')
		if (args.validLabel) {
			await expect(hint.innerHTML).toEqual(args.validLabel)
		}
	}

	// minlength / maxlength
	if (args.minlength) {
		await expect(textarea).toHaveProperty('minLength', args.minlength)
	}

	if (args.maxlength) {
		await expect(textarea).toHaveProperty('maxLength', args.maxlength)
	}

	// floating
	if (args.floating) {
		await expect(element).toHaveClass('vv-textarea--floating')
	}

	// loading
	if (args.loading) {
		await expect(element).toHaveClass('vv-textarea--loading')
	}

	// hint
	if (args.hintLabel) {
		await expect(hint.innerHTML).toEqual(args.hintLabel)
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
