import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function radioGroupTest({ canvasElement }) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	const radio1 = document.getElementById('o1')
	const radio2 = document.getElementById('o2')
	radioCheck(radio1, false)
	await expect(radio1).toBeClicked()
	classTest(radioGroupParent, [
		'vv-input-radio-group',
		'vv-input-radio-group--horizontal'
	])
	classTest(radio1, ['focus-visible', 'vv-input-radio__input--checked'])
	radioCheck(radio1, true)
	radioCheck(radio2, false)
	accessibilityTest(radioGroupParent)
}

async function disabledTest() {
	const radio = document.getElementById('disabled_opt0')
	expect(radio).toHaveClass('vv-input-radio__input--disabled')
	expect(radio).toBeDisabled()
	await radioCheck(radio, false)
	await userEvent.click(radio)
	await expect(radio).not.toBeClicked()
	await radioCheck(radio, false)
	accessibilityTest(radio.parentElement)
}

async function errorLabelTest({ canvasElement }) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	expect(radioGroupParent).toHaveClass('vv-input-radio-group--invalid')
	accessibilityTest(radioGroupParent)
}

async function hintLabelTest({ canvasElement, ...data }) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	const labelInnerHTML = radioGroupParent.lastChild.innerHTML
	const hintLabel = data.args.hintLabel
	expect(labelInnerHTML).toBeTruthy()
	expect(hintLabel).toBeTruthy()
	expect(labelInnerHTML).toEqual(hintLabel)
}

async function labelTest({ canvasElement, ...data }) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	const labelInnerHTML = radioGroupParent.firstChild.innerHTML
	const hintLabel = data.args.label
	expect(labelInnerHTML).toBeTruthy()
	expect(hintLabel).toBeTruthy()
	expect(labelInnerHTML).toEqual(hintLabel)
}

async function readonlyTest() {
	const radios = ['readonly_opt0', 'readonly_opt1', 'readonly_opt2']
	radios.forEach((radio) => {
		expect(document.getElementById(radio)).toHaveClass(
			'vv-input-radio__input--readonly'
		)
	})
}

async function validTest({ canvasElement }) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	expect(radioGroupParent).toHaveClass('vv-input-radio-group--valid')
	accessibilityTest(radioGroupParent)
}

async function verticalTest({ canvasElement }) {
	const radioGroupParent = await within(canvasElement).findByRole(
		'radiogroup'
	)
	expect(radioGroupParent).not.toHaveClass('vv-input-radio-group--horizontal')
}

expect.extend({
	async toBeClicked(radioInput) {
		let result = {
			pass: false,
			message: `Click event doesn't work`
		}
		await userEvent.click(radioInput)
		await radioInput.click()
		if (radioInput.checked) {
			result = {
				pass: true,
				message: `Click event work!`
			}
		}
		return result
	}
})

async function classTest(input, classNames = []) {
	classNames.forEach((cssClass) => {
		expect(input).toHaveClass(cssClass)
	})
}

async function accessibilityTest(element) {
	expect.extend(toHaveNoViolations)
	expect(await axe(element)).toHaveNoViolations()
}

async function radioCheck(radio, value) {
	expect(radio.ariaChecked).toBe(`${value}`)
	expect(radio.checked).toBe(value)
}

export {
	radioGroupTest,
	errorLabelTest,
	hintLabelTest,
	labelTest,
	disabledTest,
	readonlyTest,
	validTest,
	verticalTest
}
