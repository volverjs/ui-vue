import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { within } from '@storybook/testing-library'
import { expect } from '@/test/expect'

export async function radioTest(
	{ ...data }: PlayAttributes = {} as PlayAttributes,
	{
		isClickDisabled = false,
		className = null,
		slotContent = null
	}: ComponentConfig = {}
) {
	const radio =
		(document.getElementById(data.args.id) as HTMLInputElement) ||
		(document.getElementsByClassName(
			'vv-input-radio__input'
		)[0] as HTMLInputElement)

	expect(radio).toHaveClass('vv-input-radio__input')
	className && expect(radio).toHaveClass(className)

	if (isClickDisabled) {
		await expect(radio).not.toBeClicked()
	} else {
		await expect(radio).toBeClicked()
		expect(radio.checked).toBe(true)
		expect(radio).toHaveClass([
			'focus-visible',
			'vv-input-radio__input--checked'
		])
	}
	data.args.name && expect(radio.name).toEqual(data.args.name)
	const label = radio.parentElement
	expect(label).toHaveClass('vv-input-radio')
	expect(label?.innerText).toEqual(
		slotContent ? slotContent : data.args.label
	)
	data.args.error && expect(label).toHaveClass('vv-input-radio--invalid')
	expect(radio && label).toHaveNoViolations()
}

export async function hintLabelTest({
	canvasElement,
	...data
}: PlayAttributes) {
	const label = document.getElementsByClassName(
		'vv-input-radio'
	)[0] as HTMLElement
	const propLabel: string | string[] =
		data.args.hintLabel || data.args.errorLabel
	const hintLabel = label.lastElementChild as HTMLElement
	expect(hintLabel).toHaveClass('vv-input-radio__hint')
	// test hint label based on his type
	if (typeof propLabel == 'string') {
		expect(hintLabel.innerText).toEqual(propLabel)
	}
	if (Array.isArray(propLabel)) {
		propLabel.forEach((label) => {
			expect(hintLabel.innerHTML).toContain(label)
		})
	}
	await radioTest({ canvasElement, ...data })
}

export async function slotsTest({ canvasElement }: PlayAttributes) {
	const inputTextWrapperParent = await within(canvasElement).findByTestId(
		'input-text'
	)
	const inputTextWrapper = inputTextWrapperParent.children[0]
	const button = inputTextWrapper.lastElementChild as HTMLButtonElement
	expect(button).toHaveClass('vv-button')
	expect(button.innerText).toBe('QUA!')
}
