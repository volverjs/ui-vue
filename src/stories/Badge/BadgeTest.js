import { Canvas, Meta, Story } from '@storybook/addon-docs'
import { axe, toHaveNoViolations } from 'jest-axe'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

export const variantTest = async ({ badge, color }) => {
	expect(badge).toHaveClass(`vv-badge--${color}`)
}

export const accessibilityTest = async (badge) => {
	expect.extend(toHaveNoViolations)
	expect(await axe(badge)).toHaveNoViolations()
}

// Test Variants function
export const testBadgeVariant = async ({ canvasElement, name }) => {
	const badge = await within(canvasElement).findByRole('status')
	await accessibilityTest(badge)
	await variantTest({ badge, color: name })
}

export default testBadgeVariant
