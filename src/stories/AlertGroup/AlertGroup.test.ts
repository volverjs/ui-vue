import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement

	expect(element).toHaveClass('vv-alert-group')

	// check alert group list
	const alertGroupList = element.getElementsByClassName(
		'vv-alert-group__list',
	)?.[0]
	expect(alertGroupList).toBeTruthy()

	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: args.modifiers.split(' ')

	// modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(element).toHaveClass(`vv-alert-group--${modifier}`)
		}
	}

	// stack
	if (args.stack) {
		expect(element).toHaveClass('vv-alert-group--stack')
	}

	// reverse
	if (args.reverse) {
		expect(element).toHaveClass('vv-alert-group--reverse')
	}

	// position
	if (args.position) {
		expect(element).toHaveClass(`vv-alert-group--${args.position}`)
	}

	if (args.inline && args.block) {
		expect(element).toHaveClass(
			`vv-alert-group--${args.block}-${args.inline}`,
		)
	}

	// slot default
	if (args.default) {
		const div = document.createElement('div')
		div.innerHTML = args.default
		expect(alertGroupList.firstElementChild?.innerHTML).toEqual(
			div.innerHTML,
		)
	}

	// slot before
	if (args.before) {
		const div = document.createElement('div')
		div.innerHTML = args.before
		expect(element.firstElementChild?.innerHTML).toEqual(div.innerHTML)
	}

	// slot after
	if (args.after) {
		const div = document.createElement('div')
		div.innerHTML = args.after
		expect(element.lastElementChild?.innerHTML).toEqual(div.innerHTML)
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
