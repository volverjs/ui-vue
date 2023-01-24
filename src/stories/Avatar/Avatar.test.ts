import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement

	// slot default
	if (!args.default && !args.imgSrc) {
		throw new Error('Default slot or imgSrc is required!')
	}

	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: [args.modifiers]

	// modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(element).toHaveClass(`vv-avatar--${modifier}`)
		}
	}

	// check img tag exist
	if(args.imgSrc) {
		expect(element).toHaveImgChild('img')
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
