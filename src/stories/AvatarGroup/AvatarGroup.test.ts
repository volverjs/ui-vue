import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/test'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement

	// slot default
	if (!args.default && !args.items && !args.items?.length) {
		throw new Error('Default slot or items is required!')
	}

	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: [args.modifiers]

	// modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(element).toHaveClass(`vv-avatar-group--${modifier}`)
		}
	}

	// check children numbers
	if (args.items && args.items.length && !args.default) {
		if ((args.totalItems || args.items.length) > args.toShow) {
			expect(element.children.length).toEqual(args.toShow + 1)
		}
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
