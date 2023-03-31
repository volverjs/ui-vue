import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement

	if (!args.items || !args.items?.length) {
		throw new Error('No items passed')
	}

	// check children number the same of items prop
	expect(element.children?.[0].children.length).toEqual(args.items?.length)

	// check accessibility
	await expect(element).toHaveNoViolations()
}
