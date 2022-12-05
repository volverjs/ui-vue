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
	expect(dropdown).toHaveClass('vv-dropdown')
	className && expect(dropdown).toHaveClass(className)
	const options = [...dropdown.children]
	const propOptions = data.args.options
	const value = document.getElementById('value')
	if (data.args.labelNoResult && propOptions.length == 0) {
		const optionLabel = options[0].firstChild as HTMLInputElement
		expect(optionLabel.innerText).toEqual(data.args.labelNoResult)
	}
	if (propOptions.length > 0) {
		let checkedOptions = 0
		for (let index = 0; index < options.length; index++) {
			const option = options[index]
			const optionLabel = option.children[0] as HTMLInputElement
			const propOptionLabel =
				propOptions[index].label || propOptions[index]
			const propOptionValue =
				propOptions[index].value || propOptions[index]
			const optionRadio = optionLabel.children[0] as HTMLInputElement
			isClickDisabled && expect(optionLabel).not.toBeClicked()
			data.args.disabled && expect(optionRadio).toHaveProperty('disabled')
			if (
				(data.args.maxValue && checkedOptions == data.args.maxValues) ||
				isClickDisabled
			) {
				await expect(optionLabel).not.toBeClicked()
			} else {
				await expect(optionLabel).toBeClicked()
			}
			await expect(optionLabel.innerText).toEqual(propOptionLabel)
			await expect(optionRadio.value).toEqual(`${propOptionValue}`)
			if (!isClickDisabled) {
				data.args.maxValues && checkedOptions == data.args.maxValues
					? expect(optionRadio.checked).toBe(false)
					: expect(optionRadio.checked).toBe(true)
			}
			data.args.useObject &&
				expect(value?.innerText).toBe(
					`Value: { "label": "${propOptionLabel}", "value": ${propOptionValue} }`
				)
			optionRadio.checked && checkedOptions++
		}
		if (data.args.multiple) {
			let checkedOptions = 0
			for (let index = 0; index < options.length; index++) {
				const option = options[index]
				const optionLabel = option.children[0] as HTMLInputElement
				const optionRadio = optionLabel.children[0] as HTMLInputElement
				optionRadio.checked && checkedOptions++
			}
			expect(checkedOptions).toBeGreaterThan(0)
		}
	}
	expect(dropdown).toHaveNoViolations()
}
