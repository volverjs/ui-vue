import { expect } from '@/test/expect'
import { userEvent, within } from '@storybook/testing-library'

expect.extend({
	toBeChecked(checkbox) {
		checkbox.click()
		if (checkbox.checked) {
			return {
				pass: true,
				message: () => `Checkbox is checked`
			}
		}
		return {
			pass: false,
			message: () => `Checkbox is not checked`
		}
	}
})

async function checkTest({ functions, ...data }) {
	const checkbox = document.getElementById(data.args.id)
	if (functions) {
		functions.forEach(async (func) => {
			await func({ checkbox, ...data })
		})
	}
	await expect(checkbox.parentElement).toHaveNoViolations()
}

async function booleanTest({ checkbox }) {
	checkbox.addEventListener('click', (event) => {
		expect(event).toBeTruthy()
	})
	await expect(checkbox).toBeChecked()
}

async function binaryTest(data) {
	const checkbox = document.getElementById(data.args.id)
	expect(checkbox.parentElement).toHaveClass('vv-checkbox')
	const checkValue = value.innerText.replace('Valore selez: ', '')
	await expect(checkValue).toEqual(data.args.falseValue)
	checkbox.addEventListener('change', (event) => {
		expect(event).toBeTruthy()
	})
	await expect(checkbox).toBeChecked()
	const value = document.getElementById('value')
	await expect(checkValue).toEqual(data.args.trueValue)
}

async function disabledTest({ args }) {
	const checkbox = document.getElementById(args.id)
	await expect(checkbox.parentElement).toHaveClass('vv-checkbox--disabled')
	await expect(checkbox).toBeDisabled()
	await expect(checkbox).toHaveProperty('disabled')
	await expect(checkbox).not.toBeChecked()
	await expect(checkbox.parentElement).toHaveNoViolations()
}

async function readOnlyTest({ args }) {
	const checkbox = document.getElementById(args.id)
	expect(checkbox).toHaveProperty('readOnly')
	await expect(checkbox).toHaveClass('vv-checkbox__input--readonly')
	userEvent.click(checkbox)
	await expect(checkbox).toBeChecked()
	await classTest(checkbox, ['focus-visible', 'vv-checkbox__input--readonly'])
	await expect(checkbox).toHaveNoViolations()
}

async function switchTest({ canvasElement, args }) {
	const checkbox = document.getElementById(args.id)
	expect(checkbox).toBeChecked()
	const selected = await await within(canvasElement).findByTestId('selected')
	expect(selected.innerText.replace(/\s/g, '')).toEqual(
		JSON.stringify(args.value).replace(/\s/g, '')
	)
}

async function hintLabelTest(data, propLabel = data.args.hintLabel) {
	const hintText =
		document.getElementsByClassName('vv-checkbox__hint')[0].innerText
	if (typeof propLabel == 'string') {
		expect(hintText).toEqual(propLabel)
	}
	if (Array.isArray(propLabel)) {
		propLabel.forEach((label) => {
			expect(hintText).toContain(label)
		})
	}
}

async function classTest(input, classNames = []) {
	classNames.forEach((cssClass) => {
		expect(input).toHaveClass(cssClass)
	})
}

async function errorTest(data) {
	const checkbox = document.getElementById(data.args.id)
	await expect(checkbox.parentElement).toHaveClass('vv-checkbox--invalid')
	if (data.args.errorLabel) {
		hintLabelTest(data, data.args.errorLabel)
	}
	await expect(checkbox).toHaveNoViolations()
}

export {
	checkTest,
	booleanTest,
	binaryTest,
	disabledTest,
	readOnlyTest,
	switchTest,
	hintLabelTest,
	errorTest
}
