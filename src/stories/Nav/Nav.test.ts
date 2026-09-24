import type { PlayAttributes } from '@/test/types'
import { userEvent, within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')

    const menuEl = element.getElementsByClassName('vv-nav__menu')[0]

    if (!args.items?.length) {
        throw new Error('No items passed')
    }

    // check children number the same of items prop
    expect(menuEl.children.length).toEqual(args.items?.length)

    // check accessibility
    await expect(element).toHaveNoViolations()
}

export async function keyboardTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const picked = await canvas.findByTestId('picked')

    // VvNav listens for clicks on the list, and activating an item from the
    // keyboard fires one: a link with Enter
    canvas.getByRole('menuitem', { name: 'Item 1' }).focus()
    await userEvent.keyboard('{Enter}')
    await expect(picked).toHaveTextContent('Item 1')

    // and a button with Space
    canvas.getByRole('menuitem', { name: 'Item 3' }).focus()
    await userEvent.keyboard(' ')
    await expect(picked).toHaveTextContent('Item 3')
}
