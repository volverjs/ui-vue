import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'
import { userEvent } from '@storybook/testing-library'

export async function dialogTest(data: PlayAttributes = {} as PlayAttributes) {
	const button = document.getElementsByClassName('vv-button')[0]
	const dialog = document.getElementById(data.args.id)

	//display test
	expect(dialog?.style.display).toEqual('none')
	await userEvent.click(button)
	expect(dialog?.style.display).toEqual('')

	// dialog component class test
	expect(dialog).toHaveClass('vv-dialog')
	data.args.size && expect(dialog).toHaveClass(`vv-dialog--${data.args.size}`)
	const dialogWrapper = dialog?.firstElementChild
	expect(dialogWrapper).toHaveClass('vv-dialog__wrapper')
	const dialogContent = dialogWrapper?.children[0] as HTMLDivElement
	expect(dialogContent).toHaveClass('vv-dialog__content')
	// slot test
	expect(dialogContent?.innerText).toEqual('Lorem ipsum dolor sit amet')

	data.args.autoClose && expect(dialog).toHaveProperty('open', true)
	await expect(dialog).toHaveNoViolations()
}
