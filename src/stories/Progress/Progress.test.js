import { expect } from '@/test/expect'
import { within } from '@storybook/testing-library'

async function progressTest({ canvasElement }) {
	const progress = await within(canvasElement).findByRole('progressbar')
	expect(progress).toHaveClass('vv-progress')
	await expect(progress).toHaveNoViolations()
}

async function indeterminateTest({ canvasElement }) {
	const progress = await within(canvasElement).findByRole('progressbar')
	await classTest(progress, ['vv-progress', 'vv-progress--indeterminate'])
	await expect(progress).toHaveNoViolations()
}

async function classTest(progress, classNames = []) {
	classNames.forEach((cssClass) => {
		expect(progress).toHaveClass(cssClass)
	})
}

export { progressTest, indeterminateTest, classTest }
