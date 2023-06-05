<div align="center">
  
[![volverjs](.storybook/static/volverjs-ui.svg)](https://volverjs.github.io/ui-vue)

## @volverjs/ui-vue

`vue` `components` `component-library` `design-system` \
`input` `button` `accordion` `badge` `combobox` `breadcrumb` `dialog`\
`checkbox` `radio` `textarea` `badge`

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=volverjs_ui-vue&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=volverjs_ui-vue) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=volverjs_ui-vue&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=volverjs_ui-vue) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=volverjs_ui-vue&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=volverjs_ui-vue) [![Depfu](https://badges.depfu.com/badges/4b0c9d8ea210e93aa7a181e7252716f2/status.svg)](https://depfu.com) [![Depfu](https://badges.depfu.com/badges/4b0c9d8ea210e93aa7a181e7252716f2/overview.svg)](https://depfu.com/github/volverjs/ui-vue?project_id=38572)

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
pnpm add @volverjs/ui-vue

# yarn
yarn add @volverjs/ui-vue

# npm
npm install @volverjs/ui-vue --save
```

<br />

## Usage

Install the plugin in your `main.ts` file.

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

// import @volverjs/ui-vue plugin
import { VolverPlugin } from '@volverjs/ui-vue'
// import @volverjs/ui-vue icons collections
import iconsCollections from '@volverjs/ui-vue/icons'
/*
 * import @volverjs/style base style with reset and props
 * for scss support you can import the scss file
 * import '@volverjs/style/scss/base'
 */
import '@volverjs/style/base'

const app = createApp(App).mount('#app')

// install the plugin
app.use(VolverPlugin, {
  iconsCollections,
  /*
   * if you want can import components globally
   * components: { VvButton, VvInputText }
   */
  compoments: undefined,
  /*
   * if you want can import directives globally
   * directives: { toolip: VTooltip }
   */
  directives: undefined,
  /*
   * if you want can create components aliases
   * aliases: { Btn: VvButton, BtnDanger: VvButton}
   */
  aliases: undefined,
  /*
   * if you want can change default props
   * for globally imported components and aliases
   * defaults: { VvButton: { modifiers: 'secondary', BtnDanger: { modifiers: 'danger' } }
   */
  defaults: undefined
})
```

Than you can import components and use them in your templates.

```html
<script setup lang="ts">
  // MyComponent.vue
  /*
   * import the component
   * all components are also available with a dedicated export
   * import VvButton from '@volverjs/ui-vue/vv-button'
   */
  import { VvButton } from '@volverjs/ui-vue/components'
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
          /*
           * enable/disable auto import of components style
           * also accept 'scss' for scss support
           * default: false
           */
          importStyle: false,
          /*
           * enable/disable auto import of directives
           * default: false
           */
          directives: false,
          /*
           * Change components prefix
           * default: 'vv'
           */
          prefix: 'vv'
        })
      ]
    })
  ]
})
```

## Roadmap

The following features are planned for the next releases:

- [x] (v0.0.3) `VvTooltip` component and `v-tooltip` directive;
- [x] (v0.0.3) Redesign of `VvCombobox` for better accessibility and more features;
- [x] (v0.0.3) Rewrite of `VvDropdown` to get it applicable to any element;
- [x] (v0.0.5) Input masks for `VvInputText` component;
- [x] (v0.0.6) `VvAvatar` and `VvAvatarGroup` component;
- [x] (v0.0.6) Menus, navigation and tabs with `VvNav` and `VvTab`;
- [x] (v0.0.6) Alerts, notifications and toasts with `VvAlert` and `VvAlertGroup` component;
- [ ] Loaders with `VvLoader` and `VvSkeleton`;
- [ ] `VvTable` component with sort, filters, pagination and cell editing;
- [ ] Multiple uploads, image crop and file previews with `VvInputFile`;
- [ ] Carousel and galleries with `VvCarousel` component;
- [ ] Calendar and date picker with `VvCalendar` component.

## Documentation

To learn more about `@volverjs/ui-vue`, check [its documentation](https://volverjs.github.io/ui-vue).

## License

[MIT](http://opensource.org/licenses/MIT)
