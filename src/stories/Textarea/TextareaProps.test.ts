import type { PlayAttributes } from '@/test/types'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@/test/expect'
import { textareaTest } from './TextareaMain.test'
import type { TextareaConfig } from './TextareaMain.test'

export async function autoclearTest({
	canvasElement,
	...data
}: PlayAttributes) {
	const textarea = document.querySelector('textarea') as HTMLTextAreaElement
	expect(data.args.autoclear).toBe(true)
	await textareaTest({ canvasElement, ...data })
	const button = document.getElementsByClassName(
		'vv-button'
	)[0] as HTMLButtonElement
	await expect(button).toBeClicked()
	expect(textarea.value).toBe('')
}

export async function hintLabelTest(
	{ canvasElement, ...data }: PlayAttributes,
	{ className }: TextareaConfig
) {
	const textareaWrapperParent = await within(canvasElement).findByTestId(
		'textarea'
	)
	let propLabel: string | string[]
	const hintLabel = textareaWrapperParent.lastChild?.innerText as HTMLElement

	// test hint label based on his prop
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
	await textareaTest({ canvasElement, ...data }, { className: className })
}

export async function limitTest({ canvasElement, ...data }: PlayAttributes) {
	const textarea = document.querySelector('textarea') as HTMLTextAreaElement
	const limit = document.getElementsByClassName(
		'vv-textarea__limit'
	)[0] as HTMLElement
	!data.args.maxlength &&
		expect(textarea.value.length).toEqual(parseInt(limit.innerText))
	await textareaTest({ canvasElement, ...data })
	if (data.args.maxlength) {
		while (textarea.value.length < data.args.maxlength)
			await userEvent.keyboard(
				' dolor sit amet, consectetur adipiscing elit'
			)
		expect(textarea.value.length).toEqual(data.args.maxlength)
		data.args.limit == true &&
			expect(limit.innerText).toEqual(
				`${textarea.value.length}/${data.args.maxlength}`
			)
		data.args.limit == 'countdown' &&
			expect(limit.innerHTML).toBe(
				`${data.args.maxlength - textarea.value.length}`
			)
	}
}

export async function iconTest(
	{ canvasElement, ...data }: PlayAttributes,
	customElement: TextareaConfig
) {
	const icon = customElement || document.querySelector('svg')
	expect(icon.customElement || icon).toHaveClass([
		'vv-icon',
		'iconify',
		'iconify--normal',
		'iconify--ds'
	])
	const textareaWrapperParent = await within(canvasElement).findByTestId(
		'textarea'
	)
	data.args.iconPosition &&
		expect(textareaWrapperParent).toHaveClass(
			`vv-textarea--icon-${data.args.iconPosition}`
		)
	textareaTest({ canvasElement, ...data })
}

export async function slotsTest({ canvasElement, ...data }: PlayAttributes) {
	const textareaWrapperParent = await within(canvasElement).findByTestId(
		'textarea'
	)
	const textareaWrapper = textareaWrapperParent.children[0]
	const icon = textareaWrapper.firstElementChild as HTMLElement
	iconTest({ canvasElement, ...data }, { customElement: icon })
	const button = textareaWrapper.lastElementChild as HTMLButtonElement
	expect(button).toHaveClass('vv-button')
	expect(button.innerText).toBe('QUA!')
}

export async function debounceTest({ canvasElement, ...data }: PlayAttributes) {
	const textarea = document.querySelector('textarea') as HTMLTextAreaElement
	const initialValue = document.getElementById('value') as HTMLElement
	userEvent.click(textarea)
	const text = 'test'
	userEvent.keyboard(text)
	expect(initialValue.innerText).toEqual('')
	setTimeout(() => {
		expect(initialValue.innerText).not.toEqual(textarea.value)
	}, data.args.debounce - 1)
	setTimeout(() => {
		expect(initialValue.innerText).toEqual(textarea.value)
	}, data.args.debounce + 10)
	await setTimeout(async () => {
		textarea.value = ''
		await textareaTest({ canvasElement, ...data }, { customText: text })
	}, data.args.debounce * 1.3)
}
