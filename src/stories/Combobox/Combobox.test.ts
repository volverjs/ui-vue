import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'
import { sleep } from '@/test/sleep'
import { getOptionValue } from '@/test/options'
import { defaultTest as selectDefaultTest } from '@/stories/Select/Select.test'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	// native
	if (args.native) {
		await selectDefaultTest({ canvasElement, args })
		return
	}

	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value',
	)) as HTMLElement
	const dropdown = element.getElementsByClassName(
		'vv-dropdown',
	)[0] as HTMLElement
	const dropdownFirstItem = dropdown.querySelectorAll(
		'li[role="option"]',
	)[0] as HTMLElement
	const dropdownSecondItem = dropdown.querySelectorAll(
		'li[role="option"]',
	)[1] as HTMLElement
	const hint = element.getElementsByClassName('vv-select__hint')[0]

	// disabled
	if (args.disabled) {
		await expect(element).toHaveClass('vv-select--disabled')
	}

	// readonly
	if (args.readonly) {
		await expect(element).toHaveClass('vv-select--readonly')
	}

	if (
		!args.invalid &&
		!args.disabled &&
		!args.readonly &&
		args.options &&
		args.options.length > 0
	) {
		// select first value
		await expect(dropdownFirstItem).toBeClicked()
		await sleep()
		const firstValue = getOptionValue(
			args.options[0].options ? args.options[0] : args,
			0,
		)

		// in grouped options the first element is not selectable
		if (args.multiple) {
			await expect(JSON.parse(value.innerHTML)).toEqual([firstValue])
		} else {
			await expect(value.innerHTML).toEqual(firstValue)
		}

		// select second value
		if (args.options.length > 1) {
			await expect(dropdownSecondItem).toBeClicked()
			await sleep()
			const secondValue = getOptionValue(
				args.options[0].options ? args.options[0] : args,
				1,
			)
			if (args.multiple) {
				await expect(JSON.parse(value.innerHTML)).toEqual([
					firstValue,
					secondValue,
				])
			} else {
				await expect(value.innerHTML).toEqual(secondValue)
			}
		}
	}

	// invalid
	if (args.invalid) {
		await expect(element).toHaveClass('vv-select--invalid')
		if (args.invalidLabel) {
			await expect(hint.innerHTML).toEqual(args.invalidLabel)
		}
	}

	// valid
	if (args.valid) {
		await expect(element).toHaveClass('vv-select--valid')
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
