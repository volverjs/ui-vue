import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { expect } from '@/test/expect'
import { userEvent } from '@storybook/testing-library'

export async function selectTest(
	{ ...data }: PlayAttributes,
	{ isClickDisabled = false, className = null }: ComponentConfig = {}
) {
	// classes test
	const selectParent = document.getElementById(data.args.id)
	expect(selectParent).toHaveClass('vv-select')
	className && expect(selectParent).toHaveClass(className)
	const select = document.getElementsByClassName(
		'vv-dropdown'
	)[0] as HTMLInputElement
	expect(select.parentElement).toHaveClass('vv-select__wrapper')
	const selectInput = document.getElementsByClassName(
		'vv-select__input'
	)[0] as HTMLInputElement

	// placeholder test
	data.args.placeholder &&
		expect(select.outerHTML).toContain(
			`placeholder="${data.args.placeholder}"`
		)

	// test every select option
	const selectItems = Array.from(select.children)
	let checkedOptions = 0
	for (let index = 0; index < selectItems.length; index++) {
		const label = selectItems[index].children[0]

		// click test
		if (isClickDisabled) {
			await expect(label).not.toBeClicked()
		} else {
			await expect(label).toBeClicked()
			const option = data.args.options[index]

			//  value and useObject test
			const inputRadio = label.children[0] as HTMLInputElement
			data.args.useObject
				? expect(document.getElementById('value')?.innerText).toEqual(
						`Value: { "label": "${option.label}", "value": ${option.value} }`
				  )
				: expect(inputRadio.value).toEqual(
						option.value ? `${option.value}` : `${option}`
				  )

			// maxValues, label and v-model test
			if (data.args.multiple) {
				if (checkedOptions == data.args.maxValues) {
					expect(inputRadio.checked).toBe(false)
				} else {
					expect(inputRadio.checked).toEqual(true)
					expect(
						label.textContent && selectInput.innerText
					).toContain(option.label ? `${option.label}` : `${option}`)

					// separator test
					data.args.separator &&
						index > 0 &&
						expect(selectInput.innerText).toContain(
							data.args.separator
						)
				}
			} else {
				expect(label.textContent && selectInput.innerText).toEqual(
					option.label ? `${option.label}` : `${option}`
				)
			}
			inputRadio.checked && checkedOptions++
		}
	}

	// multiple test
	if (data.args.multiple) {
		let checkedOptions = 0
		for (let index = 0; index < selectItems.length; index++) {
			const option = selectItems[index]
			const optionLabel = option.children[0] as HTMLInputElement
			const optionRadio = optionLabel.children[0] as HTMLInputElement
			optionRadio.checked && checkedOptions++
		}
		expect(checkedOptions).toBeGreaterThan(0)
	}

	expect(selectParent).toHaveNoViolations()
}

export async function searchableTest() {
	const summary = document.getElementsByTagName('summary')[0]
	await userEvent.click(summary)
	setTimeout(() => {
		userEvent.keyboard('Option 1')
	}, 700)
	const optionsList = Array.from(
		document.getElementsByClassName('vv-dropdown')
	)
	expect(optionsList.length).toBe(1)
}
