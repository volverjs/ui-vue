import type { PlayAttributes } from '@/test/types'
import { userEvent, within } from 'storybook/test'
import { expect } from '@/test/expect'
import { dispatchWheel } from '@/test/wheel'

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

export async function wheelTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const menuOf = (testId: string) =>
        canvas.getByTestId(testId).querySelector('.vv-nav__menu') as HTMLElement

    const menu = menuOf('tabs')
    const item = within(menu).getAllByRole('menuitem')[0]
    const room = menu.scrollWidth - menu.clientWidth
    await expect(room).toBeGreaterThan(80)

    // a vertical turn of the wheel scrolls the tabs sideways, at once
    await expect(dispatchWheel(item, { deltaY: 40 })).toBe(true)
    await expect(menu.scrollLeft).toBe(40)
    await expect(dispatchWheel(item, { deltaY: -40 })).toBe(true)
    await expect(menu.scrollLeft).toBe(0)

    // at the start a turn up is left to the page, and so is a turn down at
    // the end
    await expect(dispatchWheel(item, { deltaY: -40 })).toBe(false)
    menu.scrollTo({ left: room, behavior: 'instant' })
    await expect(dispatchWheel(item, { deltaY: 40 })).toBe(false)
    await expect(menu.scrollLeft).toBe(room)
    menu.scrollTo({ left: 0, behavior: 'instant' })

    // a sideways gesture and a pinch to zoom are left to the browser
    await expect(dispatchWheel(item, { deltaX: 30, deltaY: 5 })).toBe(false)
    await expect(dispatchWheel(item, { deltaY: 40, ctrlKey: true })).toBe(false)
    await expect(menu.scrollLeft).toBe(0)

    // and so is an event that cannot be cancelled, which keeps its default
    // scroll, and one another listener has cancelled already
    await expect(dispatchWheel(item, { deltaY: 40, cancelable: false })).toBe(false)
    await expect(menu.scrollLeft).toBe(0)
    const cancel = (event: Event) => event.preventDefault()
    item.addEventListener('wheel', cancel)
    await expect(dispatchWheel(item, { deltaY: 40 })).toBe(true)
    await expect(menu.scrollLeft).toBe(0)
    item.removeEventListener('wheel', cancel)

    // a wheel that counts lines or pages rather than pixels scrolls by lines
    // of 40px or by the width of the tabs
    await expect(
        dispatchWheel(item, { deltaY: 1, deltaMode: WheelEvent.DOM_DELTA_LINE }),
    ).toBe(true)
    await expect(menu.scrollLeft).toBe(40)
    menu.scrollTo({ left: 0, behavior: 'instant' })
    await expect(
        dispatchWheel(item, { deltaY: 1, deltaMode: WheelEvent.DOM_DELTA_PAGE }),
    ).toBe(true)
    await expect(menu.scrollLeft).toBe(Math.min(menu.clientWidth, room))
    menu.scrollTo({ left: 0, behavior: 'instant' })

    // a list that scrolls vertically as well keeps the wheel for itself
    menu.style.overflow = 'auto'
    menu.style.height = '1em'
    await expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight)
    await expect(dispatchWheel(item, { deltaY: 40 })).toBe(false)
    await expect(menu.scrollLeft).toBe(0)
    menu.style.removeProperty('overflow')
    menu.style.removeProperty('height')

    // a list inside the tabs that can still scroll vertically keeps the
    // wheel, also over what it holds, and hands it to the tabs at its end
    const nested = menuOf('tabs-nested')
    const notes = canvas.getByTestId('notes')
    const note = notes.firstElementChild as HTMLElement
    await expect(notes.scrollHeight).toBeGreaterThan(notes.clientHeight)
    await expect(dispatchWheel(note, { deltaY: 40 })).toBe(false)
    await expect(nested.scrollLeft).toBe(0)
    notes.scrollTo({ top: notes.scrollHeight, behavior: 'instant' })
    await expect(dispatchWheel(note, { deltaY: 40 })).toBe(true)
    await expect(nested.scrollLeft).toBe(40)

    // right to left, the tabs past the edge are on the left
    const rtl = menuOf('tabs-rtl')
    const start = rtl.scrollLeft
    await expect(dispatchWheel(rtl, { deltaY: 40 })).toBe(true)
    await expect(rtl.scrollLeft).toBe(start - 40)

    // and the page keeps the wheel at either end. At widths that depend on
    // the fonts, Chromium shifts the range of a right-to-left list by a
    // pixel, from a pixel short of the negative room to 1 rather than to 0:
    // each end is reached by scrolling past it, across a range of widths
    const rtlBox = canvas.getByTestId('rtl')
    const held: string[] = []
    for (let width = 150; width < 200; width += 0.37) {
        rtlBox.style.width = `${width}px`
        for (const [left, deltaY] of [[rtl.scrollWidth, -40], [-rtl.scrollWidth, 40]]) {
            rtl.scrollTo({ left, behavior: 'instant' })
            const end = rtl.scrollLeft
            if (dispatchWheel(rtl, { deltaY }) || rtl.scrollLeft !== end) {
                held.push(`${width.toFixed(2)}px, ${deltaY < 0 ? 'start' : 'end'}`)
            }
        }
    }
    rtlBox.style.removeProperty('width')
    await expect(held).toEqual([])

    // a nav that does not scroll sideways keeps the wheel for the page
    await expect(dispatchWheel(menuOf('sidebar'), { deltaY: 40 })).toBe(false)

    await expect(canvasElement).toHaveNoViolations()
}
