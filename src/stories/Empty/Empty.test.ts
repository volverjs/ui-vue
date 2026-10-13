import type { PlayAttributes } from '@/test/types'
import { waitFor, within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const [media] = element.getElementsByClassName('vv-empty__media')
    const [title] = element.getElementsByClassName('vv-empty__title')
    const [description] = element.getElementsByClassName('vv-empty__description')
    const [actions] = element.getElementsByClassName('vv-empty__actions')

    await expect(element).toHaveClass('vv-empty')
    if (args.modifiers) {
        await expect(element).toHaveClass(`vv-empty--${args.modifiers}`)
    }

    // the media, from the icon or from the slot
    if (args.media) {
        await expect(media.innerHTML).toContain(args.media)
    } else if (args.icon) {
        await waitFor(() => expect(media.querySelector('svg')).not.toBeNull())
    } else {
        await expect(media).toBeUndefined()
    }

    // the title, a heading only when asked for one
    await expect(title.tagName).toBe(args.titleTag.toUpperCase())
    await expect(title.textContent?.trim()).toBe(args.title)
    if (args.titleTag.startsWith('h')) {
        await expect(
            within(element).getByRole('heading', { name: args.title }),
        ).toBe(title)
    }
    await expect(description.textContent?.trim()).toBe(args.description)

    // the actions only when there is something to put in them
    if (args.default) {
        await expect(actions.innerHTML).toContain(args.default)
    } else {
        await expect(actions).toBeUndefined()
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}
