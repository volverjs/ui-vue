import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

// Test Button Modifiers

// disabled button
export const testDisabledButton = async ({ canvasElement }) => {
	const button = await within(canvasElement).findByRole('button')
	await userEvent.click(button)
	await expect(button.disabled).toBe(true)
	await accessibilityTest(button)
}

// all others buttons
export const testBlockButton = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')
	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}

export const variantTest = async ({ button, variant }) => {
	expect(button).toHaveClass(`vv-button--${variant}`)
}

export const accessibilityTest = async (button) => {
	expect.extend(toHaveNoViolations)
	expect(await axe(button)).toHaveNoViolations()
}
export default accessibilityTest
