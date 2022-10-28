import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function disabledTest() {
	const radioInput = document.getElementById('1')
	console.log({ radioInput })
	await expect(radioInput).toHaveClass('vv-input-radio__input--disabled')
	await expect(radioInput).toBeDisabled()
	await expect(radioInput).toHaveProperty('disabled')
	await expect(radioInput).not.toBeChecked()
	await accessibilityTest(radioInput)
}

async function invalidTest() {
	const radioInput = document.getElementById('6')
	console.log(radioInput.parentElement)
	await expect(radioInput.parentElement).toHaveClass(
		'vv-input-radio--invalid'
	)
	accessibilityTest(radioInput)
}

async function errorWithSingleMessageTest() {
	const radioInput = document.getElementById('7')
	await expect(radioInput.parentElement).toHaveClass(
		'vv-input-radio--invalid'
	)
	const errorMessage = radioInput.labels[0].childNodes[4].innerHTML
	expect(errorMessage).toBe('Sbagliato!')
	accessibilityTest(radioInput)
}

async function errorWithMultipleMessagesTest() {
	const radioInput = document.getElementById('8')
	await expect(radioInput.parentElement).toHaveClass(
		'vv-input-radio--invalid'
	)
	// expect(errorMessage).toBe('Sbagliato!')
	console.log(radioInput.labels)
	accessibilityTest(radioInput)
}

async function switchTest() {
	const radioInput = document.getElementById('3')
	await expect(radioInput.parentElement).toHaveClass(
		'vv-input-checkbox--switch'
	)
	userEvent.click(radioInput)
	await expect(radioInput).toBeChecked()
	console.log(radioInput.parentElement)
	accessibilityTest(radioInput)
}

expect.extend({
	async toBeChecked(radioInput) {
		let result = {
			pass: false,
			message: `Click event doesn't work`
		}
		// await userEvent.click(radioInput)
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

export {
	disabledTest,
	invalidTest,
	errorWithSingleMessageTest,
	errorWithMultipleMessagesTest
}
