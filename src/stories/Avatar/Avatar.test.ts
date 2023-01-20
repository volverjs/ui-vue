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

	// check accessibility
	await expect(element).toHaveNoViolations()
}
