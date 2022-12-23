/* eslint-disable no-console */

import { expect } from '@storybook/jest'
import { userEvent } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

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

async function switchTest() {
	const checkInput = document.getElementById('3')
	await expect(checkInput.parentElement).toHaveClass('vv-checkbox--switch')
	userEvent.click(checkInput)
	await expect(checkInput).toBeChecked()
	console.log(checkInput.parentElement)
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

export { disabledTest, readOnlyTest, switchTest }
