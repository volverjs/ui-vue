import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'
import { sleep } from '@/test/sleep'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getOptionValue = (args: any, index: number) => {
	if (args.options && args.options.length > index) {
		let value = args.options[index]
		if (args.valueKey) {
			if (typeof args.valueKey === 'function') {
				value = args.valueKey(value)
			} else if (typeof value === 'object') {
				value = value[args.valueKey]
			}
		} else if (typeof value === 'object') {
			value = value.value
		}
		return value
	}
	return undefined
}

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element'
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value'
	)) as HTMLElement
	const select = element.getElementsByTagName(
		'select'
	)[0] as HTMLSelectElement
	const hint = element.getElementsByClassName('vv-select__hint')[0]

	if (
		!args.invalid &&
		!args.disabled &&
		!args.readonly &&
		args.options &&
		args.options.length > 0
	) {
		// select first value
		const firstValue = getOptionValue(args, 0)
		select.value = firstValue
		select.dispatchEvent(new Event('change'))
		await sleep()
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
