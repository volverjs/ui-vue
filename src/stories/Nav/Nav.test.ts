import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within, userEvent } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement

	if (!args.items || !args.items?.length) {
		throw new Error('No items passed')
	}

	// check children number the same of items prop
	expect(element.children?.[0].children.length).toEqual(args.items?.length)

	// take firse and second elements
	const firstEl = await element.getElementsByTagName('a')?.[0]
	const secondEl = await element.getElementsByTagName('router-link')?.[1]
	// check they have not current class
	const secondElHasCurrentClass = secondEl.classList.contains('current')
	const firstElHasCurrentClass = firstEl.classList.contains('current')

	await expect(firstElHasCurrentClass).toBe(false)
	await expect(secondElHasCurrentClass).toBe(false)
	// click first item and check "current" css class
	await userEvent.click(firstEl)
	await expect(firstEl).toHaveClass('current')

	// check accessibility
	await expect(element).toHaveNoViolations()
}