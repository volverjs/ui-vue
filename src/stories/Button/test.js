import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function buttonTest({ canvasElement, functions, ...args }) {
	const button = await within(canvasElement).findByRole('button')
	await userEvent.click(button)

	if (functions) {
		functions.forEach(async (func) => {
			await func({ button: button, ...args })
		})
	}

	// Accessibility Test
	expect.extend(toHaveNoViolations)
	expect(await axe(button)).toHaveNoViolations()
}

async function classTest({ button, className = null }) {
	if (className) {
		expect(button).toHaveClass(`vv-button--${className}`)
	}
}

async function cssTest({ button, cssString = null }) {
	if (cssString) {
		expect(button).toHaveStyle(cssString)
	}
}
async function disableTest({ button }) {
	expect(button).toBeDisabled()
}

async function propertyTest({ button, properties = [] }) {
	properties.forEach((property) => {
		expect(button).toHaveProperty(property)
	})
}

export { buttonTest, classTest, cssTest, disableTest, propertyTest }
