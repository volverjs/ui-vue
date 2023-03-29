import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within, userEvent } from '@storybook/testing-library'
import { INPUT_TYPES, type InputType } from '@/components/VvInputText'

const valueByType = (type: InputType, mask?: string) => {
	if (mask) {
		return '1234567'
	}
	switch (type) {
		case INPUT_TYPES.TEXT:
		case INPUT_TYPES.PASSWORD:
		case INPUT_TYPES.SEARCH:
			return 'Lorem ipsum'
		case INPUT_TYPES.NUMBER:
			return '1'
		case INPUT_TYPES.EMAIL:
			return 'test@test.com'
		case INPUT_TYPES.TEL:
			return '+1234567890'
		case INPUT_TYPES.URL:
			return 'https://www.test.com'
		case INPUT_TYPES.DATE:
			return new Date().toISOString().split('T')[0]
		case INPUT_TYPES.TIME:
			return '12:00'
		case INPUT_TYPES.COLOR:
		case INPUT_TYPES.DATETIME_LOCAL:
		case INPUT_TYPES.MONTH:
		case INPUT_TYPES.WEEK:
			return undefined
	}
}

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value',
	)) as HTMLElement
	const input = element.getElementsByTagName('input')[0]
	const hint = element.getElementsByClassName('vv-input-text__hint')[0]

	// value
	if (!args.invalid && !args.disabled && !args.readonly) {
		const inputValue = valueByType(args.type, args.mask)
		if (inputValue) {
			await expect(input).toBeClicked()
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
		await expect(element).toHaveClass('vv-input-text--disabled')
		await expect(input).toHaveProperty('disabled')
		await expect(input).not.toBeClicked()
	}

	// readonly
	if (args.readonly) {
		await expect(element).toHaveClass('vv-input-text--readonly')
		await expect(input).toHaveProperty('readOnly')
	}

	// invalid
	if (args.invalid) {
		await expect(element).toHaveClass('vv-input-text--invalid')
		await expect(input).toHaveProperty('ariaInvalid')
		if (args.invalidLabel) {
			await expect(hint.innerHTML).toEqual(args.invalidLabel)
		}
	}

	// valid
	if (args.valid) {
		await expect(element).toHaveClass('vv-input-text--valid')
		await expect(input).toHaveProperty('ariaInvalid', 'false')
		if (args.validLabel) {
			await expect(hint.innerHTML).toEqual(args.validLabel)
		}
	}

	//   min / max / minlength / maxlength
	if (args.min) {
		await expect(input).toHaveProperty('min', String(args.min))
	}

	if (args.max) {
		await expect(input).toHaveProperty('max', String(args.max))
	}

	if (args.minlength) {
		await expect(input).toHaveProperty('minLength', args.minlength)
	}

	if (args.maxlength) {
		await expect(input).toHaveProperty('maxLength', args.maxlength)
	}

	// floating
	if (args.floating) {
		await expect(element).toHaveClass('vv-input-text--floating')
	}

	// loading
	if (args.loading) {
		await expect(element).toHaveClass('vv-input-text--loading')
	}

	// hint
	if (args.hintLabel) {
		await expect(hint.innerHTML).toEqual(args.hintLabel)
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
