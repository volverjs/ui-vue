import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'

function linkClick(event: Event) {
	event.preventDefault()
}

export async function defaultTest(
	data: PlayAttributes = {} as PlayAttributes,
	customSlot: false,
) {
	const breadcrumb = document.getElementsByClassName('vv-breadcrumb')[0]

	// breadcrumb component class test
	expect(breadcrumb).toHaveClass('vv-breadcrumb')

	// test every breadcrumb item
	const navLinks = breadcrumb.children[0].children
	Array.from(navLinks).forEach((linkContainer, index) => {
		const link = linkContainer.children[0] as HTMLLinkElement
		const propRoutes = data.args.routes[index]

		// label and title test
		if (!customSlot) {
			expect(link.innerText).toEqual(propRoutes.label)
		}
		expect(link.title).toEqual(propRoutes.title)

		const isNotLastItem = index < navLinks.length - 1
		if (isNotLastItem) {
			// link class test
			expect(linkContainer).toHaveClass('vv-breadcrumb__item')
			expect(link).toHaveClass('vv-breadcrumb__link')

			// click test
			link.addEventListener('click', linkClick)
			expect(link).toBeClicked()

			// tag type test
			expect(link.nodeName).toEqual('A')

			// route test
			expect(link.href).toContain(propRoutes.href)
		} else {
			expect(linkContainer).toHaveClass('vv-breadcrumb__item-active')
			expect(link.nodeName).toBe('SPAN')
		}
	})
	expect(breadcrumb).toHaveNoViolations()
}
