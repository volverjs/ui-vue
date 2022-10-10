import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

// Test Variants
export const testDefaultButton = async ({ canvasElement }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await accessibilityTest(button)
}

export const testButtonPrimary = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}
export const testButtonSecondary = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}
export const testButtonDanger = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}
export const testButtonGhost = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}
export const testButtonText = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}
export const testButtonStaticLight = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}
export const testButtonStaticDark = async ({ canvasElement, name }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: name })
	await accessibilityTest(button)
}

// Test Icon
export const testButtonIconLeft = async ({ canvasElement }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await accessibilityTest(button)
}
export const testButtonIconRight = async ({ canvasElement }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: 'reverse' })
	await accessibilityTest(button)
}
export const testButtonIconTop = async ({ canvasElement }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await accessibilityTest(button)
}
export const testButtonIconBottom = async ({ canvasElement }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: 'reverse' })
	await accessibilityTest(button)
}
export const testButtonIconOnly = async ({ canvasElement }) => {
	const button = await within(canvasElement).findByRole('button')

	await userEvent.click(button)
	await variantTest({ button, variant: 'icon-only' })
	await accessibilityTest(button)
}

export const variantTest = async ({ button, variant }) => {
	expect(button).toHaveClass(`vv-button--${variant}`)
}

export const accessibilityTest = async (button) => {
	expect.extend(toHaveNoViolations)
	expect(await axe(button)).toHaveNoViolations()
}
