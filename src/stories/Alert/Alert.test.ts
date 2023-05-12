import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLElement

	expect(element).toHaveClass('vv-alert')

	const modifiers =
		!args.modifiers || Array.isArray(args.modifiers)
			? args.modifiers
			: args.modifiers.split(' ')

	const alertHeaderEl =
		element.getElementsByClassName('vv-alert__header')?.[0]
	const closeButton = alertHeaderEl?.lastChild as HTMLElement
	const alertContentEl =
		element.getElementsByClassName('vv-alert__content')?.[0]
	const alertFooterEl =
		element.getElementsByClassName('vv-alert__footer')?.[0]

	// modifiers
	if (modifiers) {
		for (const modifier of modifiers) {
			expect(element).toHaveClass(`vv-alert--${modifier}`)
		}
	}

	// dismissable
	if (args.dismissable) {
		expect(element).toHaveClass('vv-alert--dismissable')
		expect(closeButton).toHaveClass('vv-alert__close')
	}

	// autoclose
	if (args.autoClose) {
		expect(element).toHaveClass('vv-alert--auto-close')
		expect(closeButton).toHaveClass('vv-alert__close')
		expect(closeButton.firstChild).toHaveClass('vv-alert__close-mask')
	}

	// icon
	if (args.icon) {
		expect(alertHeaderEl.firstChild).toHaveClass('vv-alert__icon')
	}

	// slot default
	if (args.default) {
		const div = document.createElement('div')
		div.innerHTML = args.default
		expect(alertContentEl.firstElementChild?.innerHTML).toEqual(
			div.innerHTML,
		)
	}

	// slot header
	if (args.header) {
		const div = document.createElement('div')
		div.innerHTML = args.header
		expect(alertHeaderEl.firstElementChild?.innerHTML).toEqual(
			div.innerHTML,
		)
	}

	// slot title before
	if (args['title::before']) {
		const div = document.createElement('div')
		div.innerHTML = args['title::before']
		expect(alertHeaderEl.firstElementChild?.innerHTML).toEqual(
			div.innerHTML,
		)
	}

	// slot title after
	if (args['title::after']) {
		const div = document.createElement('div')
		div.innerHTML = args['title::after']
		expect(alertHeaderEl.lastElementChild?.innerHTML).toEqual(div.innerHTML)
	}

	// slot footer
	if (args.footer) {
		const div = document.createElement('div')
		div.innerHTML = args.footer
		expect(alertFooterEl.firstElementChild?.innerHTML).toEqual(
			div.innerHTML,
		)
	}

	// check accessibility
	await expect(element).toHaveNoViolations()
}
