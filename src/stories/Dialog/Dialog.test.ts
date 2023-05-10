import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { userEvent } from '@storybook/testing-library'
import { within } from '@storybook/testing-library'
import { sleep } from '@/test/sleep'

export async function defaultTest(
	{ canvasElement, args }: PlayAttributes = {} as PlayAttributes,
) {
	const element = (await within(canvasElement).findByTestId(
		'element',
	)) as HTMLDialogElement
	const button = (await within(canvasElement).findByTestId(
		'button',
	)) as HTMLButtonElement

	// hidden
	await expect(element?.style.display).toEqual('none')

	// open
	await userEvent.click(button)
	await expect(element).toHaveProperty('open', true)

	// check accessibility
	await expect(element).toHaveNoViolations()

	// size
	if (args.size) {
		await expect(element).toHaveClass(`vv-dialog--${args.size}`)
	}

	// default slot
	if (args.default) {
		const defaultSlot = element.getElementsByClassName(
			'vv-dialog__content',
		)[0].firstElementChild as HTMLElement
		await expect(
			defaultSlot.innerHTML.replace(/<!--(.*?)-->/g, ''),
		).toEqual(args.default)
	}

	// header slot
	if (args.header) {
		const headerSlot = element.getElementsByClassName(
			'vv-dialog__header',
		)[0].firstElementChild as HTMLElement
		await expect(headerSlot.innerHTML.replace(/<!--(.*?)-->/g, '')).toEqual(
			args.header,
		)
	}

	// footer slot
	if (args.footer) {
		const headerSlot = element.getElementsByClassName(
			'vv-dialog__footer',
		)[0].firstElementChild as HTMLElement
		await expect(headerSlot.innerHTML.replace(/<!--(.*?)-->/g, '')).toEqual(
			args.footer,
		)
	}

	// keep open
	if (!args.keepOpen) {
		await userEvent.click(element)
		await sleep(1000)
		await expect(element).toHaveProperty('open', false)
		await expect(element?.style.display).toEqual('none')
	}
}
