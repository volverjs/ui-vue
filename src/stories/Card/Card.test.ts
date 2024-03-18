import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/test'

export async function defaulTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'card',
	)) as HTMLElement
	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: [args.modifiers]

	// check modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			await expect(element).toHaveClass(`vv-card--${modifier}`)
		}
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
