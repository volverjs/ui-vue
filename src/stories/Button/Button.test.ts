import type { PlayAttributes } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

export async function defaultTest(
	{ canvasElement, args }: PlayAttributes = {} as PlayAttributes,
) {
	const element = await within(canvasElement).findByRole('button')

	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: [args.modifiers]

	expect(element).toHaveClass('vv-button')

	// icon
	if (args.icon) {
		expect(element.innerHTML).toContain('vv-icon')
	}

	// modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(element).toHaveClass(`vv-button--${modifier}`)
		}
	}

	// disabled
	if (args.disabled) {
		await expect(element).not.toBeClicked()
	} else {
		await expect(element).toBeClicked()

		// link
		if (args.href) {
			expect(element).toHaveProperty('href')
		}
		if (args.target) {
			expect(element).toHaveProperty('target')
		}
	}

	// accessibility
	expect(element).toHaveNoViolations()
}
