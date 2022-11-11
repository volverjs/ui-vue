<div align="center">
  
[![volverjs](https://raw.githubusercontent.com/volverjs/style/main/src/assets/volverjs.svg)](https://github.com/volverjs)

## @volverjs/ui-vue

`vue` `components` `ui` `design-system` `typography`  
`input` `button` `text`

<br>

#### proudly powered by

<br>

[![24/Consulting](https://raw.githubusercontent.com/volverjs/style/main/src/assets/24consulting.svg)](https://24consulting.it)

<br>

</div>

## Install

```
$ npm i @volverjs/ui-vue
```

## Style

#### @volverjs/ui-vue is closely linked to [@volverjs/style](https://volverjs.github.io/style/) and is neeeded to style components

<br />

## Basic usage

```typescript
import { iconsSimple, iconsNormal, iconsDetailed } from '@volverjs/ui-vue/icons'
import { DesygnSystem } from '@volverjs/ui-vue'

const volver = new DesignSystem({
	iconsCollections: [iconsSimple, iconsNormal, iconsDetailed]
})

app.use(volver)
```

Constructor parameters:

```typescript
interface IDesignSystemParams {
	/**
	 * If true set "fetchOptions" with credentials: 'include'
	 */
	fetchWithCredentials?: boolean
	/**
	 * Optional fetch params
	 */
	fetchOptions?: RequestInit
	/**
	 * Array of https://docs.iconify.design/types/iconify-json.html
	 * This collections will be added during plugin install
	 */
	iconsCollections?: IconifyJSON[]
}
```

Design System definition

```typescript
interface IDesignSystem extends IDesignSystemParams {
	/**
	 * @param {String} src Icon source path (url)
	 * @param {RequestInit} options
	 * @returns {Promise<string | undefined>} String SVG if exist
	 */
	fetchIcon(src: string, options?: RequestInit): Promise<string | undefined>
	/**
	 * Add iconify collection to library https://docs.iconify.design/icon-components/vue/add-collection.html
	 * @param {IconifyJSON} collection
	 * @param {String} providerName Optional provider name
	 */
	addCollection(collection: IconifyJSON, providerName?: string): boolean
	/**
	 * Add icon to collection https://docs.iconify.design/icon-components/vue/add-icon.html
	 * @param {String} name
	 * @param {IconifyIcon} data
	 * @returns {Boolean} true on success, false if something is wrong with data
	 */
	addIcon(name: string, data: IconifyIcon): boolean
}
```
