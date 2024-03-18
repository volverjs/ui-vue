import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within, userEvent } from '@storybook/test'
import { INPUT_TYPES, type InputType } from '@/components/VvInputText'

const valueByType = (type: InputType, mask?: string, id?: string) => {
	if (mask) {
		switch (id) {
			case 'phone-number':
				return { toType: '393923847556' }
			case 'date-placeholder':
				return { toType: '01011970', toCheck: '1970-01-01' }
			case 'phone-or-email':
				return {
					toType:
						Math.random() < 0.5 ? '393923847556' : 'test@test.com',
				}
			case 'intl-number':
				return { toType: '1234567890.22' }
			case 'currency':
				return { toType: '1234567890.22' }
			default:
				return { toType: '1234567890' }
		}
	}
	switch (type) {
		case INPUT_TYPES.TEXT:
		case INPUT_TYPES.PASSWORD:
		case INPUT_TYPES.SEARCH:
			return { toType: 'Lorem ipsum' }
		case INPUT_TYPES.NUMBER:
			return { toType: '1' }
		case INPUT_TYPES.EMAIL:
			return { toType: 'test@test.com' }
		case INPUT_TYPES.TEL:
			return { toType: '+1234567890' }
		case INPUT_TYPES.URL:
			return { toType: 'https://www.test.com' }
		case INPUT_TYPES.DATE:
			return { toType: new Date().toISOString().split('T')[0] }
		case INPUT_TYPES.TIME:
			return { toType: '12:00' }
		case INPUT_TYPES.COLOR:
		case INPUT_TYPES.DATETIME_LOCAL:
		case INPUT_TYPES.MONTH:
		case INPUT_TYPES.WEEK:
			return { toType: undefined }
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
		const { toType, toCheck } = valueByType(args.type, args.iMask, args.id)
		if (toType) {
			await expect(input).toBeClicked()
			await userEvent.keyboard(toType)
			await sleep()
			if (args.maxlength) {
				await expect(value.innerHTML).toEqual(
					toType.slice(0, args.maxlength),
				)
			} else {
				await expect(value.innerHTML).toEqual(toCheck ?? toType)
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
