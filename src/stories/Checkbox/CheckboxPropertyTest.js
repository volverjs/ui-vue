/* eslint-disable no-console */
import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function checkTest({ canvasElement, functions, ...data }) {
	const checkboxParent = await within(canvasElement).findByTestId('checkbox')
	const checkbox = document.getElementById(`${data.args.id}`)
	console.log(data)
	expect(checkbox).toBeChecked()
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
	console.log([checkboxParent.checkboxParent.attributes[0]])
	// expect(checkboxParent.children[0]).toHaveClass('vv-checkbox')
	checkbox.addEventListener('change', (event) => {
		expect(event).toBeTruthy
	})
	await userEvent.click(checkbox)
	await classTest(checkbox, [
		'focus-visible',
		'vv-input-check__input--checked'
	])
}

async function binaryTest() {
	const checkbox = document.getElementById('5')
	expect(checkbox.parentElement).toHaveClass('vv-checkbox')
	// userEvent.click(checkbox)
	userEvent.click(checkbox)
	accessibilityTest(checkbox)
	checkbox.addEventListener('change', (event) => {
		console.log(event)
	})
}

async function disabledTest() {
	const checkInput = document.getElementById('1')
	await expect(checkInput).toHaveClass('vv-input-check__input--disabled')
	await expect(checkInput).toBeDisabled()
	await expect(checkInput).toHaveProperty('disabled')
	await expect(checkInput).not.toBeChecked()
	await expect(checkInput.value).toBe('')
	await accessibilityTest(checkInput)
}

async function readOnlyTest() {
	const checkInput = document.getElementById('2')
	console.log(checkInput.modelValue)
	expect(checkInput).toHaveProperty('readOnly')
	await expect(checkInput).toHaveClass('vv-input-check__input--readonly')
	userEvent.click(checkInput)
	await expect(checkInput).toBeChecked()
	await console.log({ checkInput })
	await classTest(checkInput, [
		'focus-visible',
		'vv-input-check__input--checked',
		'vv-input-check__input--readonly'
	])
	accessibilityTest(checkInput)
}

expect.extend({
	async toBeChecked(checkInput) {
		let result = {
			pass: false,
			message: `Click event doesn't work`
		}
		// await userEvent.click(checkInput)
		await checkInput.click()
		if (checkInput.checked) {
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

export { checkTest, booleanTest, binaryTest, disabledTest, readOnlyTest }
