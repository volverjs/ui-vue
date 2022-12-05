import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

interface InputTextConfig {
	isClickDisabled?: boolean
	className?: string | string[] | null
}

export async function dropdownTest(
	{ canvasElement, ...data }: PlayAttributes = {} as PlayAttributes,
	{ isClickDisabled = false, className = null }: InputTextConfig = {}
) {
	const dropdown = await within(canvasElement).findByRole('listbox')

	// class test
	expect(dropdown).toHaveClass('vv-dropdown')
	className && expect(dropdown).toHaveClass(className)

	// options test
	const dropdownItems = [...dropdown.children]
	const propOptions = data.args.options
	const value = document.getElementById('value')
	if (data.args.labelNoResult && propOptions.length == 0) {
		const optionLabel = dropdownItems[0].firstChild as HTMLInputElement
		expect(optionLabel.innerText).toEqual(data.args.labelNoResult)
	}
	if (propOptions.length > 0) {
		let checkedOptions = 0

		// tests all the options
		for (let index = 0; index < dropdownItems.length; index++) {
			const option = dropdownItems[index]
			const optionLabel = option.children[0] as HTMLInputElement
			const optionRadio = optionLabel.children[0] as HTMLInputElement

			// disabled test
			isClickDisabled && expect(optionLabel).not.toBeClicked()
			data.args.disabled && expect(optionRadio).toHaveProperty('disabled')

			// click test
			isClickDisabled
				? await expect(optionLabel).not.toBeClicked()
				: await expect(optionLabel).toBeClicked()

			// radio checked and maxValue test
			if (!isClickDisabled) {
				data.args.maxValues && checkedOptions == data.args.maxValues
					? expect(optionRadio.checked).toBe(false)
					: expect(optionRadio.checked).toBe(true)
			}
			optionRadio.checked && checkedOptions++

			// label and value test
			const propOptionLabel =
				propOptions[index].label || propOptions[index]
			const propOptionValue =
				propOptions[index].value || propOptions[index]
			await expect(optionLabel.innerText).toEqual(propOptionLabel)
			await expect(optionRadio.value).toEqual(`${propOptionValue}`)

			// useObject test
			data.args.useObject &&
				expect(value?.innerText).toBe(
					`Value: { "label": "${propOptionLabel}", "value": ${propOptionValue} }`
				)
		}

		// multiple test
		if (data.args.multiple) {
			let checkedOptions = 0
			for (let index = 0; index < dropdownItems.length; index++) {
				const option = dropdownItems[index]
				const optionLabel = option.children[0] as HTMLInputElement
				const optionRadio = optionLabel.children[0] as HTMLInputElement
				optionRadio.checked && checkedOptions++
			}
			expect(checkedOptions).toBeGreaterThan(0)
		}
	}
	expect(dropdown).toHaveNoViolations()
}
