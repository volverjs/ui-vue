import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function checkTest({ canvasElement, functions, ...data }) {
	const checkboxParent = await within(canvasElement).findByTestId('checkbox')
	const checkbox = document.getElementById(`${data.args.id}`)
	await expect(checkbox).toBeChecked()
	if (functions) {
		functions.forEach(async (func) => {
			await func({ checkboxParent, ...data })
		})
	}
	// Accessibility Test
	expect.extend(toHaveNoViolations)
	expect(await axe(checkboxParent)).toHaveNoViolations()
}

async function booleanTest(checkboxParent) {
	const checkbox = document.getElementById(`${checkboxParent.args.id}`)
	checkbox.addEventListener('click', (event) => {
		expect(event).toBeTruthy()
	})
	await userEvent.click(checkbox)
	await classTest(checkbox, [
		'focus-visible',
		'vv-input-check__input--checked'
	])
}

async function binaryTest({ ...data }) {
	const checkbox = document.getElementById('5')
	expect(checkbox.parentElement).toHaveClass('vv-input-checkbox')
	const checkValue = value.innerText.replace('Valore selez: ', '')
	await expect(checkValue).toEqual(data.args.falseValue)
	checkbox.addEventListener('change', (event) => {
		expect(event).toBeTruthy()
	})
	await expect(checkbox).toBeChecked()
	const value = document.getElementById('value')
	await expect(checkValue).toEqual(data.args.trueValue)
}

async function disabledTest() {
	const checkInput = document.getElementById('1')
	await expect(checkInput).toHaveClass('vv-input-check__input--disabled')
	await expect(checkInput).toBeDisabled()
	await expect(checkInput).toHaveProperty('disabled')
	await expect(checkInput).not.toBeChecked()
	await accessibilityTest(checkInput)
}

async function readOnlyTest() {
	const checkInput = document.getElementById('2')
	expect(checkInput).toHaveProperty('readOnly')
	await expect(checkInput).toHaveClass('vv-input-check__input--readonly')
	userEvent.click(checkInput)
	await expect(checkInput).toBeChecked()
	await classTest(checkInput, [
		'focus-visible',
		'vv-input-check__input--checked',
		'vv-input-check__input--readonly'
	])
	accessibilityTest(checkInput)
}

async function switchTest({ canvasElement, ...data }) {
	const checkInput = document.getElementById('3')
	expect(checkInput).toBeChecked()
	const value = await (
		await within(canvasElement).findByTestId('checkbox')
	).lastElementChild
	expect(value.innerText.replace(/\s/g, '')).toContain(
		JSON.stringify(data.args.value)
	)
}

async function hintLabelTest({ ...data }) {
	const errorLabel = document.getElementsByClassName(
		'vv-input-checkbox__hint'
	)[0]
	const propLabel = data.args.errorLabel
	if (typeof propLabel == 'string') {
		expect(errorLabel).toEqual(propLabel)
	}
	if (Array.isArray(propLabel)) {
		propLabel.forEach((label) => {
			expect(errorLabel).toContain(label)
		})
	}
}

expect.extend({
	async toBeChecked(checkInput) {
		let result = {
			pass: false,
			message: `Click event doesn't work`
		}
		await checkInput.click()
		const classList = Array.from(checkInput.classList)
		const checkedClass = classList.find(
			(cssClass) => cssClass == 'vv-input-check__input--checked'
		)
		if (checkInput.checked && checkedClass) {
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

export {
	checkTest,
	booleanTest,
	binaryTest,
	disabledTest,
	readOnlyTest,
	switchTest,
	hintLabelTest
}
