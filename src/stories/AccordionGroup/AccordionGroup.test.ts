import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element'
	)) as HTMLElement
	const firstChild = element.children[0] as HTMLDetailsElement
	const value = (await within(canvasElement).findByTestId(
		'value'
	)) as HTMLElement

	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: [args.modifiers]

	expect(element).toHaveClass('vv-accordion-group')

	// modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(element).toHaveClass(`vv-accordion-group--${modifier}`)
		}
	}

	// open
	if (!args.disabled && args.items && args.items.length > 0) {
		expect(firstChild.open).toBe(false)
		expect(firstChild).toBeClicked()
		await sleep()
		expect(firstChild.open).toBeTruthy()
		if (args.collapse) {
			expect(JSON.stringify(JSON.parse(value.innerText))).toBe(JSON.stringify([args.items[0].name]))
		} else {
			expect(value.innerText).toBe(args.items[0].name)
		}
		const summary = firstChild.firstChild as HTMLElement
		const content = firstChild.lastChild as HTMLElement
		expect(summary.getAttribute('aria-expanded')).toBe('true')
		expect(content.getAttribute('aria-hidden')).toBe('false')
	}

	// accessibility
	await expect(element).toHaveNoViolations()
}
