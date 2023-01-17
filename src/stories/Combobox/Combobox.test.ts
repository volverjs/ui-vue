import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'
import { sleep } from '@/test/sleep'
import { getOptionValue } from '@/test/options'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element'
	)) as HTMLElement
	const value = (await within(canvasElement).findByTestId(
		'value'
	)) as HTMLElement
	const dropdown = element.getElementsByClassName(
		'vv-dropdown'
	)[0] as HTMLElement
	const dropdownFirstItem = dropdown.getElementsByTagName(
		'label'
	)[0] as HTMLElement
	const dropdownSecondItem = dropdown.getElementsByTagName(
		'label'
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
		const firstValue = getOptionValue(args, 0)
		if (args.multiple) {
			await expect(JSON.parse(value.innerHTML)).toEqual([firstValue])
		} else {
			await expect(value.innerHTML).toEqual(firstValue)
		}

		// select second value
		if (args.options.length > 1) {
			await expect(dropdownSecondItem).toBeClicked()
			await sleep()
			const secondValue = getOptionValue(args, 1)
			if (args.multiple) {
				await expect(JSON.parse(value.innerHTML)).toEqual([
					firstValue,
					secondValue
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
