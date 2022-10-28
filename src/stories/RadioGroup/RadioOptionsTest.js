import { expect } from '@storybook/jest'

async function mainOptionsTest({ functions, ...data }) {
	const options = data.args.options
	options.forEach((option, index) => {
		const radio = document.getElementById(`options_opt${index}`)
		const radioValue = radio._value
		const radioLabel = radio.parentElement.innerText
		functions.forEach(async (func) => {
			await func({ ...data }, index, radioValue, radioLabel)
		})
	})
}

async function radioOptionsTest({ ...data }, index, radioValue, radioLabel) {
	const optionValue = data.args.options[index].value
	const optionLabel = data.args.options[index].label
	expect(optionLabel).toEqual(radioLabel)
	expect(optionValue).toEqual(radioValue)
}

async function arrayOptionsTest({ ...data }, index, radioValue, radioLabel) {
	const optionValue = data.args.options[index]
	expect(optionValue).toEqual(radioLabel)
	expect(optionValue).toEqual(radioValue)
}

async function optionsValueStringTest(
	{ ...data },
	index,
	radioValue,
	radioLabel
) {
	const optionValue = data.args.options[index].qta
	const optionLabel = data.args.options[index].label
	expect(optionLabel).toEqual(radioLabel)
	expect(optionValue).toEqual(radioValue)
}

async function optionsValueFunctionTest({ ...data }, index, radioValue) {
	const optionValue = data.args.options[index].qta
	const optionLabel = data.args.options[index].label
	const resultValue = `${optionValue}_${optionLabel}`
	expect(radioValue).toEqual(resultValue)
}

async function optionsLabelStringTest(
	{ ...data },
	index,
	radioValue,
	radioLabel
) {
	const optionValue = data.args.options[index].value
	const optionLabel = data.args.options[index].name
	expect(optionLabel).toEqual(radioLabel)
	expect(optionValue).toEqual(radioValue)
}

async function optionsLabelFunctionTest(
	{ ...data },
	index,
	radioValue,
	radioLabel
) {
	const optionLabel = data.args.options[index].name
	const resultLabel = `Frutto: ${optionLabel}`
	expect(radioLabel).toEqual(resultLabel)
}

export {
	mainOptionsTest,
	radioOptionsTest,
	arrayOptionsTest,
	optionsValueStringTest,
	optionsValueFunctionTest,
	optionsLabelStringTest,
	optionsLabelFunctionTest
}
