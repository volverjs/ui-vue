import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
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
