import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function stableKeysTest({ canvasElement }: PlayAttributes) {
    const canvas = within(canvasElement)
    const element = await canvas.findByTestId('element')
    const avatars = [...element.getElementsByClassName('vv-avatar')]
    expect(avatars.length).toBeGreaterThan(0)

    // new modifiers restyle the avatars in place instead of drawing them again
    expect(await canvas.findByTestId('square')).toBeClicked()
    await sleep()
    const restyled = [...element.getElementsByClassName('vv-avatar')]
    expect(
        restyled.every(avatar => avatar.classList.contains('vv-avatar--square')),
    ).toBe(true)
    expect(restyled.map((avatar, index) => avatar === avatars[index])).toEqual(
        avatars.map(() => true),
    )
}

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')

    // slot default
    if (!args.default && !args.items && !args.items?.length) {
        throw new Error('Default slot or items is required!')
    }

    const modifiers
        = !args.modifiers || Array.isArray(args.modifiers)
            ? args.modifiers
            : [args.modifiers]

    // modifiers
    if (modifiers) {
        for (const modifier of modifiers) {
            expect(element).toHaveClass(`vv-avatar-group--${modifier}`)
        }
    }

    // check children numbers
    if (args.items && args.items.length && !args.default) {
        if ((args.totalItems || args.items.length) > args.toShow) {
            expect(element.children.length).toEqual(args.toShow + 1)
        }
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}
