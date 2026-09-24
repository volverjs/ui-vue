import type { PlayAttributes } from '@/test/types'
import { userEvent, waitFor } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function selectFromKeyboardTest({ canvasElement }: PlayAttributes) {
    const element = canvasElement.getElementsByClassName(
        'vv-input-file',
    )[0] as HTMLElement
    const items = () =>
        [...element.getElementsByClassName('vv-input-file__item')] as HTMLElement[]
    // the list is `vuedraggable`, loaded on demand, so a fixed pause is not
    // enough under load: wait for the items themselves
    await waitFor(() => expect(items()).toHaveLength(2))

    // with a preview to pick, every file can be reached from the keyboard
    expect(items().map(item => item.getAttribute('tabindex'))).toEqual(['0', '0'])
    expect(items()[0]).toHaveClass('active')
    expect(items()[0].getAttribute('aria-current')).toBe('true')

    // Enter picks the focused file
    items()[1].focus()
    await userEvent.keyboard('{Enter}')
    await sleep()
    expect(items()[1]).toHaveClass('active')
    expect(items()[1].getAttribute('aria-current')).toBe('true')
    expect(items()[0].getAttribute('aria-current')).toBeNull()

    // and so does Space
    items()[0].focus()
    await userEvent.keyboard(' ')
    await sleep()
    expect(items()[0]).toHaveClass('active')

    // accessibility
    await expect(element).toHaveNoViolations()
}
