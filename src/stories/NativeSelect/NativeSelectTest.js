import { expect } from '@storybook/jest'
import { userEvent, within } from '@storybook/testing-library'
import { toHaveNoViolations, axe } from 'jest-axe'

async function nativeSelectTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		data.args['data-testId']
	)
	expect(selectParent).toHaveClass('vv-select')
	const select = selectParent.children[1].children[0]
	expect(select.parentElement).toHaveClass('vv-select__wrapper')
	userEvent.click(select)
	data.args.options.forEach((option, index) => {
		const opt = select[index + 1]
		opt.selected = true
		expect(select.value).toBe(JSON.stringify(option.value))
	})
	const opt_1 = select[1]
	opt_1.selected = true
	expect(select.value).toBe(JSON.stringify(data.args.options[0].value))
	accessibilityTest(selectParent)
}

async function disabledTest({ canvasElement }) {
	const selectParent = await within(canvasElement).findByTestId('select')
	const select = selectParent.children[1].children[0]
	expect(select).toBeDisabled()
	expect(select).toHaveProperty('disabled', true)
	accessibilityTest(select)
}

async function errorTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		data.args['data-testId']
	)
	expect(data.args.error).toBe(true)
	expect(selectParent).toHaveClass('vv-select--invalid')
	const errorLabel = selectParent.lastChild
	expect(errorLabel.innerText).toEqual(data.args.errorLabel)
	accessibilityTest(selectParent)
}

async function hintLabelTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		data.args['data-testId']
	)
	const labelInnerHTML = selectParent.lastChild.innerHTML
	const hintLabel = data.args.hintLabel
	expect(labelInnerHTML).toBeTruthy()
	expect(labelInnerHTML).toEqual(hintLabel)
}

async function iconTest({ canvasElement }) {
	// icon-left
	const selectParent1 = await within(canvasElement).findByTestId('icon-left')
	expect(selectParent1).toHaveClass('vv-select--icon-left')
	const iconLeft = selectParent1.children[1].children[0]
	expect(iconLeft).toHaveClass(
		'vv-icon',
		'iconify',
		'iconify--normal',
		'iconify--vv'
	)
	// icon-right
	const selectParent2 = await within(canvasElement).findByTestId('icon-right')
	expect(selectParent2).toHaveClass('vv-select--icon-right')
	const iconRight = selectParent1.children[1].children[0]
	expect(iconRight).toHaveClass(
		'vv-icon',
		'iconify',
		'iconify--normal',
		'iconify--vv'
	)
	accessibilityTest(selectParent1, selectParent2)
}

async function loadingTest({ canvasElement, ...data }) {
	const selectParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	expect(data.args.loading).toBe(true)
	expect(selectParent).toHaveClass('vv-select--loading')
	accessibilityTest(selectParent)
}
async function optionsTest({ canvasElement, ...data }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const options = selectWrapperParent.children[1].children[0]
	const propOptions = data.args.options
	propOptions.forEach((propOption, index) => {
		expect(options[index + 1].value).toEqual(
			`${propOption.value || propOption}`
		)
		expect(options[index + 1].innerText).toEqual(
			`${propOption.label || propOption}`
		)
	})
}

async function readonlyTest({ canvasElement, ...data }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const select = selectWrapperParent.children[1].children[0]
	expect(data.args.readonly).toBe(true)
	expect(selectWrapperParent).toHaveClass('vv-select--readonly')
	expect(select).toHaveProperty('disabled', true)
	accessibilityTest(selectWrapperParent)
}

async function validTest({ canvasElement, ...data }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const validLabel = selectWrapperParent.lastChild
	expect(data.args.valid).toBe(true)
	expect(selectWrapperParent).toHaveClass('vv-select--valid')
	expect(validLabel).toHaveClass('vv-select__hint')
	expect(selectWrapperParent).toHaveClass('vv-select vv-select--valid')
	expect(data.args.validLabel).toEqual(validLabel.innerText)
	accessibilityTest(selectWrapperParent)
	accessibilityTest(validLabel)
}

async function customKeysTest({ canvasElement, ...data }) {
	const selectWrapperParent = await within(canvasElement).findByTestId(
		'native-select'
	)
	const select = selectWrapperParent.children[1].children[0]
	const labelKey = data.args['label-key']
	const valueKey = data.args['value-key']
	const options = data.args.options
	expect(labelKey && valueKey).toBeTruthy()
	options.forEach((option, index) => {
		expect(select[index + 1].value).toEqual(`${option[valueKey]}`)
		expect(select[index + 1].innerText).toEqual(`${option[labelKey]}`)
	})
}

async function accessibilityTest(element) {
	expect.extend(toHaveNoViolations)
	expect(await axe(element)).toHaveNoViolations()
}

export {
	nativeSelectTest,
	errorTest,
	hintLabelTest,
	iconTest,
	loadingTest,
	optionsTest,
	disabledTest,
	readonlyTest,
	validTest,
	customKeysTest
}
