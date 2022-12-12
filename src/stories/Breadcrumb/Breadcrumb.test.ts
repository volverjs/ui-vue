import type { PlayAttributes } from '@/test/types'
import { expect } from '@/test/expect'

interface BreadcrumbConfig {
	className?: string | string[] | null
}

export async function breadcrumbTest(
	{ ...data }: PlayAttributes = {} as PlayAttributes,
	{ className = null }: BreadcrumbConfig = {}
) {
	const breadcrumb = document.getElementsByClassName('vv-breadcrumb')[0]

	// breadcrumb component class test
	expect(breadcrumb).toHaveClass('vv-breadcrumb')
	className && expect(breadcrumb).toHaveClass(className)

	// test every breadcrumb item
	const navLinks = breadcrumb.children[0].children
	Array.from(navLinks).forEach((linkContainer, index) => {
		const link = linkContainer.children[0] as HTMLLinkElement
		const propRoutes = data.args.routes[index]

		// label and title test
		expect(link.innerText).toEqual(propRoutes.label)
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
			const expectedNodeName = data.args.multiline ? 'ROUTER-LINK' : 'A'
			expect(link.nodeName).toEqual(expectedNodeName)

			// route test
			data.args.multiline
				? expect(link.outerHTML).toContain(`to="${propRoutes.to}"`)
				: expect(link.href).toContain(propRoutes.href)
		} else {
			expect(linkContainer).toHaveClass('vv-breadcrumb__item-active')
			expect(link.nodeName).toBe('SPAN')
		}
	})
	expect(breadcrumb).toHaveNoViolations()
}

function linkClick(event: Event) {
	event.preventDefault()
}
