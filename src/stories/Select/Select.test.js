import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

export async function selectTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		data.args['data-testId']
	)
	expect(selectParent).toHaveClass('vv-select')
	const select = document.getElementsByClassName('vv-dropdown')[0]
	expect(select.parentElement).toHaveClass('vv-select__wrapper')
	const selectInput = document.getElementsByClassName('vv-select__input')[0]
	const dropdownItems = Array.from(select.children)
	for (let index = 0; index < dropdownItems.length; index++) {
		const label = dropdownItems[index].children[0]
		await userEvent.click(label)
		expect(label.textContent && selectInput.innerText).toEqual(
			data.args.options[index].label
		)
		const inputRadio = label.children[0]
		expect(inputRadio.value).toEqual(`${data.args.options[index].value}`)
	}
	accessibilityTest(selectParent)
}

async function accessibilityTest(element) {
	expect.extend(toHaveNoViolations)
	expect(await axe(element)).toHaveNoViolations()
}
