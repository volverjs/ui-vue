import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/test'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement

	if (!args.items || !args.items?.length) {
		throw new Error('No items passed')
	}

	// check children number the same of items prop
	const childrenEls = element.getElementsByClassName('vv-nav')[0]
	expect(childrenEls?.children[0].children.length).toEqual(args.items?.length)

	// take firse and second elements
	const firstNavItemLabelEl =
		await element.getElementsByClassName('vv-nav__item-label')?.[0]
	await expect(firstNavItemLabelEl.classList.contains('current')).toBe(true)

	// check tab content to include "Tab 1"
	const firstTabPanelEl = element.getElementsByClassName('vv-tab__panel')?.[0]
	await expect(firstTabPanelEl.classList.contains('target')).toBe(true)

	// check accessibility
	await expect(element).toHaveNoViolations()
}
