import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'

export async function defaultCardTest(data: PlayAttributes) {
	const card = document.getElementsByClassName('vv-card')[0] as HTMLElement
	data.args.variant && expect(card.outerHTML).toContain('variant="glass"')
	card.children.length == 0 && expect(card.innerText).toBe('Default')
	await expect(card).toHaveNoViolations()
}

export async function cardSlotsTest(data: PlayAttributes) {
	const card = document.getElementsByClassName('vv-card')[0] as HTMLElement
	const tags = ['header', 'picture', 'content', 'footer']
	const cardItems = card.children
	Array.from(cardItems).forEach((item, index) => {
		index != 3
			? expect(item.children[0] || item).toHaveClass(
					`vv-card__${tags[index]}`
			  )
			: expect(item).toHaveClass(`vv-card__${tags[index]}`)
		index != 2
			? expect(item.nodeName).toEqual(tags[index].toUpperCase())
			: expect(item.nodeName).toEqual('DIV')
	})
	await defaultCardTest(data)
}
