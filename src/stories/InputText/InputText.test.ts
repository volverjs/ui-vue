import type { PlayAttributes } from '@/test/types'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@/test/expect'

interface InputTextConfig {
	isClickDisabled?: boolean
	className?: string | string[] | null
	customText?: string | number | null
	customElement?: HTMLElement | HTMLOrSVGElement | null
}

export async function testInputText(
	{ canvasElement, ...data }: PlayAttributes = {} as PlayAttributes,
	{
		isClickDisabled = false,
		className = null,
		customText = null
	}: InputTextConfig = {}
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
			if (!data.args.limit && data.args.maxLength) {
				data.args.maxLength >= text.length
					? expect(inputText.value).toEqual(text)
					: expect(inputText.value.length).toEqual(
							data.args.maxLength
					  )
			} else {
				expect(inputText.value).toEqual(data.args.modelValue || text)
			}
		}
	}
	const baseAttrs = [
		'id',
		'name',
		'placeholder',
		'required',
		'autofocus',
		'autocomplete',
		'disabled',
		'type',
		'max',
		'maxLength',
		'min',
		'minLength'
	]
	baseAttrs.forEach((attr) => {
		data.args[attr] &&
			expect(`${inputText[attr]}` || inputText[attr]).toEqual(
				`${data.args[attr]}` || data.args[attr]
			)
	})
	data.args.label &&
		expect(inputTextWrapperParent.firstChild?.innerText).toEqual(
			data.args.label
		)
	data.args.modelValue &&
		expect(inputText.value).toEqual(data.args.modelValue)
	data.args.readonly && expect(inputText.readOnly).toEqual(data.args.readonly)
	expect(inputTextWrapperParent).toHaveClass(
		'vv-input-text',
		'vv-input-text--dirty'
	)
	className && expect(inputTextWrapperParent).toHaveClass(className)
	expect(inputTextWrapperParent).toHaveNoViolations()
}

export async function autoclearTest({
	canvasElement,
	...data
}: PlayAttributes) {
	const inputText = document.querySelector('input') as HTMLInputElement
	expect(data.args.autoclear).toBe(true)
	await testInputText({ canvasElement, ...data })
	const button = document.getElementsByClassName(
		'vv-button'
	)[0] as HTMLButtonElement
	await expect(button).toBeClicked()
	expect(inputText.value).toBe('')
}

export async function hintLabelTest(
	{ canvasElement, ...data }: PlayAttributes,
	{ className }: InputTextConfig
) {
	const inputTextWrapperParent = await within(canvasElement).findByTestId(
		'input-text'
	)
	let propLabel: string | string[]
	const hintLabel = inputTextWrapperParent.lastChild?.innerText as HTMLElement
	if (data.args.loading) {
		data.args.error || data.args.valid
			? (propLabel = data.args.loadingLabel)
			: (propLabel = data.args.loadingLabel)
	} else if (data.args.error) {
		propLabel = data.args.errorLabel
	} else if (data.args.valid) {
		propLabel = data.args.validLabel
	} else {
		propLabel = data.args.hintLabel
	}
	if (typeof propLabel == 'string') {
		expect(hintLabel).toEqual(propLabel)
	}
	if (Array.isArray(propLabel)) {
		propLabel.forEach((label) => {
			expect(hintLabel).toContain(label)
		})
	}
	await testInputText({ canvasElement, ...data }, { className: className })
}

export async function limitTest({ canvasElement, ...data }: PlayAttributes) {
	const inputText = document.querySelector('input') as HTMLInputElement
	await testInputText({ canvasElement, ...data })
	const limit = document.getElementsByClassName(
		'vv-input-text__limit'
	)[0] as HTMLElement
	if (data.args.maxLength) {
		while (inputText.value.length < data.args.maxLength)
			await userEvent.keyboard(
				' dolor sit amet, consectetur adipiscing elit'
			)
		expect(inputText.value.length).toEqual(data.args.maxLength)
		data.args.showLimit == true &&
			data.args.showLimitMode !== 'countdown' &&
			expect(limit.innerText).toEqual(
				`${inputText.value.length}/${data.args.maxLength}`
			)
		data.args.showLimit == true &&
			data.args.showLimitMode == 'countdown' &&
			expect(limit.innerHTML).toBe(
				`${data.args.maxLength - inputText.value.length}`
			)
	}
}

export async function iconTest(
	{ canvasElement, ...data }: PlayAttributes,
	customElement: InputTextConfig
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
	expect(button.innerText).toBe('QUA!')
}

export async function debounceTest({ canvasElement, ...data }: PlayAttributes) {
	const inputText = document.querySelector('input') as HTMLInputElement
	const initialValue = document.getElementById('value') as HTMLElement
	userEvent.click(inputText)
	const text = 'test'
	userEvent.keyboard(text)
	expect(initialValue.innerText).toEqual('')
	setTimeout(() => {
		expect(initialValue.innerText).not.toEqual(inputText.value)
	}, data.args.debounce - 1)
	setTimeout(() => {
		expect(initialValue.innerText).toEqual(inputText.value)
	}, data.args.debounce + 10)
	await setTimeout(async () => {
		inputText.value = ''
		await testInputText({ canvasElement, ...data }, { customText: text })
	}, data.args.debounce * 1.3)
}

export async function inputNumberTest({
	canvasElement,
	...data
}: PlayAttributes) {
	const inputText = document.querySelector('input') as HTMLInputElement
	const actionButtonGroup = document.getElementsByClassName(
		'vv-input-text__actions-group'
	)
	userEvent.click(inputText)
	const buttonUp = actionButtonGroup[0].firstElementChild as HTMLButtonElement
	const buttonDown = actionButtonGroup[0]
		.lastElementChild as HTMLButtonElement
	for (let i = 1; i < 3; i++) {
		buttonUp.click()
		// userEvent.keyboard(`${data.args.step * i}`)
		// console.log(inputText.value, `${data.args.step * i}`)
		expect(inputText.value).toEqual(`${data.args.step * i}`)
		// inputText.value = ''
	}
	for (let i = 3; i > data.args.step; i--) {
		buttonDown.click()
		// userEvent.keyboard(`${i - data.args.step}`)
		// console.log(inputText.value, `${i - data.args.step}`)
		expect(inputText.value).toEqual(`${i - data.args.step}`)
		// inputText.value = ''
	}
	await testInputText({ canvasElement, ...data })
}
