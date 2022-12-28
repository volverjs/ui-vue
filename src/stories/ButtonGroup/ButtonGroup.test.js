import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'

async function buttonGroupTest({ canvasElement, functions, ...args }) {
	const buttonGroup = await within(canvasElement).findByRole('group')
	await expect(buttonGroup).toBeClicked()
	if (functions) {
		functions.forEach(async (func) => {
			await func({ buttonGroup, ...args })
		})
	}
	await expect(buttonGroup).toHaveNoViolations()
}

async function mixClassTest({
	buttonGroup,
	numberOfElements = null,
	classToTest = null
}) {
	let conunter = 0
	const buttons = buttonGroup.children

	for (const button of buttons) {
		const buttonClassList = [...button.classList]

		if (buttonClassList.includes(`vv-button--${classToTest}`)) {
			conunter++
		}
	}
	expect(conunter).toBe(numberOfElements)
}

async function classTest({ buttonGroup, className = null }) {
	if (className) {
		expect(buttonGroup).toHaveClass(`vv-button-group--${className}`)
	}
}

export { buttonGroupTest, classTest, mixClassTest }
