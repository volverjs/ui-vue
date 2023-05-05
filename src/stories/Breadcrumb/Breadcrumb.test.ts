import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'

function linkClick(event: Event) {
	event.preventDefault()
}

export async function defaultTest(
	data: PlayAttributes = {} as PlayAttributes,
	customSlot: boolean,
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
			await expect(link.innerText).toEqual(propRoutes.label)
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
