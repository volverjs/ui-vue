import { expect } from '@storybook/jest'
import { toHaveNoViolations, axe } from 'jest-axe'
import { hintLabelTest } from './CheckPropertyTest.js'

async function errorTest({ ...data }) {
	const checkInput = document.getElementById(data.args.id)
	await expect(checkInput.parentElement).toHaveClass(
		'vv-input-checkbox--invalid'
	)
	if (data.args.errorLabel) {
		hintLabelTest({ ...data })
	}
	await accessibilityTest(checkInput)
}

expect.extend({
	async toBeChecked(checkInput) {
		let result = {
			pass: false,
			message: `Click event doesn't work`
		}
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

async function accessibilityTest(element) {
	expect.extend(toHaveNoViolations)
	expect(await axe(element)).toHaveNoViolations()
}

export { errorTest }
