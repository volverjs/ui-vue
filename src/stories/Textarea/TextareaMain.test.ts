import type { PlayAttributes, ComponentConfig } from '@/test/types'
import { within, userEvent } from '@storybook/testing-library'
import { expect } from '@/test/expect'

export async function textareaTest(
	{ canvasElement, ...data }: PlayAttributes = {} as PlayAttributes,
	{
		isClickDisabled = false,
		className = null,
		customText = null
	}: ComponentConfig = {}
) {
	const textareaWrapperParent = await within(canvasElement).findByTestId(
		'textarea'
	)
	const textarea = document.querySelector('textarea') as HTMLTextAreaElement

	// click test
	if (isClickDisabled) {
		await expect(textarea).not.toBeClicked()
	} else {
		await expect(textarea).toBeClicked()
		await userEvent.click

		// test maxlength and text
		const text = customText || 'Lorem ipsum'
		userEvent.keyboard(text)
		if (!data.args.limit && data.args.maxlength) {
			data.args.maxlength >= text.length
				? expect(textarea.value).toEqual(text)
				: expect(textarea.value.length).toEqual(data.args.maxlength)
		} else {
			expect(textarea.value).toEqual(data.args.modelValue || text)
		}
	}

	// test html attributes
	const baseAttrs = [
		'id',
		'name',
		'placeholder',
		'required',
		'rows',
		'cols',
		'autofocus',
		'autocomplete',
		'disabled'
	]
	baseAttrs.forEach((attr) => {
		data.args[attr] && expect(textarea[attr]).toEqual(data.args[attr])
	})
	data.args.readonly && expect(textarea.readOnly).toEqual(data.args.readonly)

	// test label and modelValue
	data.args.label &&
		expect(textareaWrapperParent.firstChild?.innerText).toEqual(
			data.args.label
		)
	data.args.modelValue && expect(textarea.value).toEqual(data.args.modelValue)

	// class test
	expect(textareaWrapperParent).toHaveClass(
		'vv-textarea',
		'vv-textarea--dirty'
	)
	className && expect(textareaWrapperParent).toHaveClass(className)
	expect(textareaWrapperParent).toHaveNoViolations()
}
