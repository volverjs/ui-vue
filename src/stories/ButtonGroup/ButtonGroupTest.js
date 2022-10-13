import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function buttonGroupTest({ canvasElement, functions, ...args }) {
	const buttonGroup = await within(canvasElement).findByRole('group')
	await expect(buttonGroup).toBeClicked()
	if (functions) {
		functions.forEach(async (func) => {
			await func({ buttonGroup, ...args })
		})
	}
	// Accessibility Test
	expect.extend(toHaveNoViolations)
	expect(await axe(buttonGroup)).toHaveNoViolations()
}

async function mixClassTest({
	buttonGroup,
	numberOfElements = null,
	classToTest = null
}) {
	let roundedButtons = 0
	const buttons = buttonGroup.children

	for (const button of buttons) {
		const buttonClassList = [...button.classList]

		if (buttonClassList.includes(`vv-button--${classToTest}`)) {
			roundedButtons++
		}
	}
	expect(roundedButtons).toBe(numberOfElements)
}

expect.extend({
	async toBeClicked(buttonGroup) {
		let result = {
			pass: false,
			message: `Click event doesn't work`
		}
		buttonGroup.addEventListener('click', ({ target }) => {
			if (target.id == 'btn2') {
				result = {
					pass: true,
					message: `Click event work!`
				}
			}
		})
		await userEvent.click(buttonGroup.children[1])
		return result
	}
})

async function classTest({ buttonGroup, className = null }) {
	if (className) {
		expect(buttonGroup).toHaveClass(`vv-button-group--${className}`)
	}
}

export { buttonGroupTest, classTest, mixClassTest }
