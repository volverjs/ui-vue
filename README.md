<div align="center">
  
[![volverjs](.storybook/static/volverjs-beta.svg)](https://volverjs.github.io/ui-vue)

## @volverjs/ui-vue

`vue` `components` `component-library` `design-system` \
`input` `button` `accordion` `badge` `combobox` `breadcrumb` `dialog`\
`checkbox` `radio` `textarea` `badge`

<br>

#### proudly powered by

<br>

[![24/Consulting](.storybook/static/24consulting.svg)](https://24consulting.it)

<br>

</div>

## Install

`@volverjs/ui-vue` is closely linked to [`@volverjs/style`](https://volverjs.github.io/style/) and is neeeded to style components.

```bash
# pnpm
pnpm add @volverjs/style @volverjs/ui-vue

# yarn
yarn add @volverjs/style @volverjs/ui-vue

# npm
npm install @volverjs/style @volverjs/ui-vue --save
```

<br />

## Usage

Install the plugin in your `main.ts` file.

```typescript
import { createApp } from 'vue'
import App from './App.vue'

// import @volverjs/ui-vue plugin
import { VolverPlugin } from '@volverjs/ui-vue'
// import @volverjs/ui-vue icons collections
import iconsCollections from '@volverjs/ui-vue/icons'
/*
 * import @volverjs/style reset and props
 * for scss support you can import the scss files
 * import '@volverjs/style/scss/reset'
 * import '@volverjs/style/scss/props'
 */
import '@volverjs/style/reset'
import '@volverjs/style/props'

const app = createApp(App).mount('#app')

// install the plugin
app.use(VolverPlugin, {
  iconsCollections
})
```

Than you can import components and use them in your templates.

```html
<script setup lang="ts">
  import { VvButton } from '@volverjs/ui-vue'
  /*
   * import the component style
   * for scss support you can import the scss file
   * import '@volverjs/style/scss/vv-button'
   */
  import '@volverjs/style/vv-button'
</script>

<template>
  <VvButton label="Button" />
</template>
```

## Icons Collections

`@volverjs/ui-vue` comes with a set of icons with different levels of details. You can use them by importing `@volverjs/ui-vue/icons`.

To learn more about icons collections, check [icons documentation](src/components/VvIcon/README.md).

## Unplugin Resolver

You can use `@volverjs/ui-vue` with [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) to automatically import components and styles.

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { VolverResolver } from '@volverjs/ui-vue/resolvers/unplugin'

export default defineConfig({
  // ...
  plugins: [
    // ...
    Components({
      resolvers: [
        VolverResolver({
          // enable/disable import of style
          // default: false
          importStyle: 'css' // or 'scss'
        })
      ]
    })
  ]
})
```

## Documentation

To learn more about `@volverjs/ui-vue`, check [its documentation](https://volverjs.github.io/ui-vue).

## License

[MIT](http://opensource.org/licenses/MIT)
