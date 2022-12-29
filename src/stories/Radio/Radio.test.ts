import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { expect } from '@/test/expect'

export async function radioTest(
	data: PlayAttributes = {} as PlayAttributes,
	{
		isClickDisabled = false,
		className = null,
		slotContent = null
	}: ComponentConfig = {}
) {
	const radio =
		(document.getElementById(data.args.id) as HTMLInputElement) ||
		(document.getElementsByClassName(
			'vv-radio__input'
		)[0] as HTMLInputElement)

	expect(radio).toHaveClass('vv-radio__input')
	className && expect(radio).toHaveClass(className)

	if (isClickDisabled) {
		await expect(radio).not.toBeClicked()
	} else {
		await expect(radio).toBeClicked()
		expect(radio.checked).toBe(true)
	}
	data.args.name && expect(radio.name).toEqual(data.args.name)
	const label = radio.parentElement
	expect(label).toHaveClass('vv-radio')
	expect(label?.innerText).toEqual(
		slotContent ? slotContent : data.args.label
	)
	data.args.error && expect(label).toHaveClass('vv-radio--invalid')
	expect(radio && label).toHaveNoViolations()
}

export async function hintLabelTest(data: PlayAttributes) {
	const label = document.getElementsByClassName('vv-radio')[0] as HTMLElement
	const propLabel: string | string[] =
		data.args.hintLabel || data.args.errorLabel
	const hintLabel = label.lastElementChild as HTMLElement
	expect(hintLabel).toHaveClass('vv-radio__hint')
	// test hint label based on his type
	if (typeof propLabel == 'string') {
		expect(hintLabel.innerText).toEqual(propLabel)
	}
	if (Array.isArray(propLabel)) {
		propLabel.forEach((label) => {
			expect(hintLabel.innerHTML).toContain(label)
		})
	}
}
