import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function testInputText(
	{ canvasElement, ...data }: PlayAttributes = {} as PlayAttributes,
	{
		isClickDisabled = false,
		className = null,
		customText = null
	}: ComponentConfig = {}
) {
	const inputTextWrapperParent = await within(canvasElement).findByTestId(
		'input-text'
	)
	const inputText = document.querySelector('input') as HTMLInputElement
	if (isClickDisabled) {
		await expect(inputText).not.toBeClicked()
	} else {
		await expect(inputText).toBeClicked()
		await userEvent.click
		if (
			inputText.type == 'text' ||
			inputText.type == 'password' ||
			inputText.type == 'search'
		) {
			const text = customText || 'Lorem ipsum'
			userEvent.keyboard(text)
			if (!data.args.limit && data.args.maxlength) {
				data.args.maxlength >= text.length
					? expect(inputText.value).toEqual(text)
					: expect(inputText.value.length).toEqual(
							data.args.maxlength
					  )
			} else if (!data.args.limit) {
				expect(inputText.value).toEqual(data.args.modelValue || text)
			}
		}
	}
	const baseAttrs = [
		'id',
		'name',
		'placeholder',
		'required',
		'type',
		'max',
		'maxlength',
		'min',
		'minlength'
	]
	baseAttrs.forEach((attr) => {
		if (data.args[attr] !== undefined) {
			expect(String(inputText.getAttribute(attr))).toEqual(
				String(data.args[attr])
			)
		}
	})
	data.args.label &&
		expect(
			(inputTextWrapperParent.firstChild as HTMLElement)?.innerText
		).toEqual(data.args.label)
	data.args.hintLabel &&
		expect(
			(inputTextWrapperParent.lastChild as HTMLElement)?.innerText
		).toEqual(data.args.hintLabel)
	data.args.modelValue &&
		expect(inputText.value).toEqual(data.args.modelValue)
	data.args.readonly && expect(inputText.readOnly).toEqual(data.args.readonly)
	await sleep()
	expect(inputTextWrapperParent).toHaveClass('vv-input-text')
	if (inputText.value) {
		expect(inputTextWrapperParent).toHaveClass('vv-input-text--dirty')
	}
	className && expect(inputTextWrapperParent).toHaveClass(className)
	await expect(inputTextWrapperParent).toHaveNoViolations()
}

export async function limitTest({ canvasElement, ...data }: PlayAttributes) {
	const inputText = document.querySelector('input') as HTMLInputElement
	await testInputText({ canvasElement, ...data })
	const limit = document.getElementsByClassName(
		'vv-input-text__limit'
	)[0] as HTMLElement
	if (data.args.maxlength) {
		while (inputText.value.length < data.args.maxlength)
			await userEvent.keyboard(
				' dolor sit amet, consectetur adipiscing elit'
			)
		data.args.limit === true &&
			expect(limit.innerText).toEqual(
				`${inputText.value.length}/${data.args.maxlength}`
			)
		data.args.limit === 'countdown' &&
			expect(limit.innerHTML).toBe(
				`${data.args.maxlength - inputText.value.length}`
			)
	}
}

export async function iconTest(
	{ canvasElement, ...data }: PlayAttributes,
	customElement: ComponentConfig
) {
	const icon = customElement || document.querySelector('svg')
	expect(icon.customElement || icon).toHaveClass([
		'vv-icon',
		'iconify',
		'iconify--normal',
		'iconify--ds'
	])
	const inputTextWrapperParent = await within(canvasElement).findByTestId(
		'input-text'
	)
	data.args.iconPosition &&
		expect(inputTextWrapperParent).toHaveClass(
			`vv-input-text--icon-${data.args.iconPosition}`
		)
	testInputText({ canvasElement, ...data })
}

export async function slotsTest({ canvasElement, ...data }: PlayAttributes) {
	const inputTextWrapperParent = await within(canvasElement).findByTestId(
		'input-text'
	)
	const inputTextWrapper = inputTextWrapperParent.children[0]
	const icon = inputTextWrapper.firstElementChild as HTMLElement
	iconTest({ canvasElement, ...data }, { customElement: icon })
	const button = inputTextWrapper.lastElementChild as HTMLButtonElement
	expect(button).toHaveClass('vv-button')
	expect(button.innerText).toBe('Here!')
}

export async function inputNumberTest({
	canvasElement,
	...data
}: PlayAttributes) {
	const inputText = document.querySelector('input') as HTMLInputElement
	const actionButtonGroup = document.getElementsByClassName(
		'vv-input-text__actions-group'
	)
	const buttonUp = actionButtonGroup[0].firstElementChild as HTMLButtonElement
	const buttonDown = actionButtonGroup[0]
		.lastElementChild as HTMLButtonElement
	userEvent.click(inputText)
	for (let i = 1; i < 4; i++) {
		buttonUp.click()
		expect(inputText.value).toEqual(`${data.args.step * i}`)
	}
	const inputValue: number = parseFloat(inputText.value)
	for (let i = inputValue; i > data.args.step; i--) {
		buttonDown.click()
		expect(inputText.value).toEqual(`${i - data.args.step}`)
	}
	await testInputText({ canvasElement, ...data })
}
