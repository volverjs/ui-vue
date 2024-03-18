import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/test'

export async function defaultTest(
	{ canvasElement, args }: PlayAttributes = {} as PlayAttributes,
) {
	const buttonGroup = (await within(canvasElement).findByTestId(
		'button-group',
	)) as HTMLElement
	const firstButton = (await within(canvasElement).findByTestId(
		'first-button',
	)) as HTMLElement
	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: [args.modifiers]

	// check modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(buttonGroup).toHaveClass(`vv-button-group--${modifier}`)
		}
	}

	// check disabled
	if (args.disabled) {
		await expect(firstButton).not.toBeClicked()
	} else {
		await expect(firstButton).toBeClicked()
	}

	// check accessibility
	await expect(buttonGroup).toHaveNoViolations()
}
