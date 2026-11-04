import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { dispatchWheel } from '@/test/wheel'

function linkClick(event: Event) {
    event.preventDefault()
}

export async function defaultTest(
    data: PlayAttributes = {} as PlayAttributes,
    customSlot: boolean = false,
) {
    const breadcrumb = document.getElementsByClassName('vv-breadcrumb')[0]

    // breadcrumb component class test
    await expect(breadcrumb).toHaveClass('vv-breadcrumb')

    // test every breadcrumb item
    const navLinks = breadcrumb.children[0].children
    Array.from(navLinks).forEach(async (linkContainer, index) => {
        const link = linkContainer.children[0] as HTMLLinkElement
        const propRoutes = data.args.routes[index]

        // label and title test
        if (!customSlot) {
            await expect(link.textContent).toEqual(propRoutes.label)
        }
        await expect(link.title).toEqual(propRoutes.title)

        const isNotLastItem = index < navLinks.length - 1
        if (isNotLastItem) {
            // link class test
            await expect(linkContainer).toHaveClass('vv-breadcrumb__item')
            await expect(link).toHaveClass('vv-breadcrumb__link')

            // click test
            link.addEventListener('click', linkClick)
            await expect(link).toBeClicked()

            // tag type test
            await expect(link.nodeName).toEqual('A')

            // route test
            await expect(link.href).toContain(propRoutes.href)
        } else {
            await expect(linkContainer).toHaveClass(
                'vv-breadcrumb__item-active',
            )
            await expect(link.nodeName).toBe('SPAN')
        }
    })
    await expect(breadcrumb).toHaveNoViolations()
}

export async function wheelTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const list = element.querySelector('.vv-breadcrumb__list') as HTMLElement
    const link = within(list).getAllByRole('link')[0]
    const room = list.scrollWidth - list.clientWidth
    await expect(room).toBeGreaterThan(40)

    // a vertical turn of the wheel scrolls the routes sideways, at once,
    // and the page keeps it at either end
    await expect(dispatchWheel(link, { deltaY: 40 })).toBe(true)
    await expect(list.scrollLeft).toBe(40)
    list.scrollTo({ left: room, behavior: 'instant' })
    await expect(dispatchWheel(link, { deltaY: 40 })).toBe(false)
    list.scrollTo({ left: 0, behavior: 'instant' })
    await expect(dispatchWheel(link, { deltaY: -40 })).toBe(false)

    await expect(element).toHaveNoViolations()
}
