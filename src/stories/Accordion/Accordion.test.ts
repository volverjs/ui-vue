import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'
import { within } from '@storybook/test'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLDetailsElement
	const summary = element.getElementsByTagName('summary')[0]
	const content = element.getElementsByClassName(
		'vv-accordion__content',
	)[0] as HTMLElement

	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: [args.modifiers]

	expect(element).toHaveClass('vv-accordion')

	// modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(element).toHaveClass(`vv-accordion--${modifier}`)
		}
	}

	// summary slot / title
	if (args.summary) {
		const div = document.createElement('div')
		div.innerHTML = args.summary
		expect(summary).toHaveClass('vv-accordion__summary')
		expect(summary.innerText).toEqual(div.innerText)
	} else if (args.title) {
		expect(summary).toHaveClass('vv-accordion__summary')
		expect(summary.innerText).toEqual(args.title)
	}

	// open
	if (!args.disabled) {
		expect(element.open).toBe(args.not ? true : false)
		expect(summary).toBeClicked()
		await sleep()
		expect(element.open).toBe(args.not ? false : true)
		expect(summary.getAttribute('aria-expanded')).toBe(
			args.not ? 'false' : 'true',
		)
		expect(content.getAttribute('aria-hidden')).toBe(
			args.not ? 'true' : 'false',
		)
	}

	// default slot / content
	if (element.open) {
		if (args.default) {
			const div = document.createElement('div')
			div.innerHTML = args.default
			expect(content.innerText).toEqual(div.innerText)
		} else if (args.content) {
			expect(content.innerText).toEqual(args.content)
		}
	}

	// accessibility
	await expect(element).toHaveNoViolations()
}
