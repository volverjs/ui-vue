import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function iconTest({ canvasElement, functions, ...args }) {
	const icon = await within(canvasElement).findByTestId('img')
	if (functions) {
		functions.forEach(async (func) => {
			await func({ icon, ...args })
		})
	}
	// Accessibility Test
	expect.extend(toHaveNoViolations)
	expect(await axe(icon)).toHaveNoViolations()
}

async function classTest({ icon, classNames = [] }) {
	classNames.forEach((cssClass) => {
		expect(icon).toHaveClass(cssClass)
	})
}

async function childElementCountTest({ icon }) {
	expect(icon.childElementCount).toBeGreaterThan(0)
}

export { iconTest, childElementCountTest, classTest }
