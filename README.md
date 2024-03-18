<div align="center">
  
[![volverjs](.storybook/static/volverjs-ui-vue.svg)](https://volverjs.github.io/ui-vue)

## @volverjs/ui-vue

`vue` `components` `component-library` `design-system` \
`input` `button` `accordion` `badge` `combobox` `breadcrumb` `dialog`\
`checkbox` `radio` `textarea` `badge`

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=volverjs_ui-vue&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=volverjs_ui-vue) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=volverjs_ui-vue&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=volverjs_ui-vue) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=volverjs_ui-vue&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=volverjs_ui-vue) [![Depfu](https://badges.depfu.com/badges/4b0c9d8ea210e93aa7a181e7252716f2/status.svg)](https://depfu.com) [![Depfu](https://badges.depfu.com/badges/4b0c9d8ea210e93aa7a181e7252716f2/overview.svg)](https://depfu.com/github/volverjs/ui-vue?project_id=38572)

<br>

maintained with ❤️ by

<br>

[![8 Wave](.storybook/static/8wave.svg)](https://8wave.it)

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
  components: undefined,
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

## Composables

`@volverjs/ui-vue`utility composables

### useAlert

Used to show alert messages and notifications

```typescript
export type AlertModifier =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'brand'
  | 'accent'
  | string
```

```typescript
export type Alert = {
  id: string | number
  title?: string
  icon?: string | VvIconProps
  content?: string
  footer?: string
  modifiers?: AlertModifier | AlertModifier[]
  dismissable?: boolean
  autoClose?: number
  closeLabel?: string
  role?: AlertRole
}
```

##### Usage

```typescript
import { useAlert } from '@volverjs/ui-vue/composables'

const { addAlert, removeAlert, alerts } = useAlert()

function showSuccess() {
  addAlert({
    title: 'Success!',
    modifiers: 'success'
  })
}
```

```html
<vv-alert-group name="alert-group" :items="alerts" @close="removeAlert" />

<div class="flex gap-md">
  <vv-button
    label="Show success"
    modifiers="secondary"
    @click="showSuccess"
    class="mb-lg"
  />
</div>
```

### useBlurhash

Used to create blurred preview image ([blurhash](https://blurha.sh/))

##### Example

```typescript
import { useBlurhash } from '@volverjs/ui-vue/composables'

const { encode, decode, loadImage } = useBlurhash()

const isLoading = ref(false)
const file = ref({})
const canvas = ref()
const isImgLoaded = ref(false)
const blurhash = ref('')
const imageUrl = ref('')
const image = ref()

watch(
  file,
  async (newValue) => {
    if (newValue?.size) {
      this.imageUrl = URL.createObjectURL(newValue)
      this.image = await this.loadImage(this.imageUrl)
      this.blurhash = await this.encode(newValue)
    } else {
      this.image = null
      this.imageUrl = ''
      this.blurhash = ''
    }
  },
  { immediate: true }
)

watch(blurhash, async (newValue) => {
  if (this.image) {
    const blurhashDecoded = await this.decode(
      newValue,
      this.image.width,
      this.image.height
    )

    if (this.canvas) {
      this.canvas.width = this.image.width
      this.canvas.height = this.image.height
      const ctx = this.canvas.getContext('2d')
      const imageData = ctx.createImageData(
        this.canvas.width,
        this.canvas.height
      )
      imageData.data.set(blurhashDecoded)
      ctx.putImageData(imageData, 0, 0)
    }
  }
})
```

```html
<div
  class="w-full grid gap-md grid-cols-3 h-150"
  :class="{ 'vv-skeleton': isLoading }"
>
  <div class="w-150 h-150 col-span-1">
    <div class="text-20 font-semibold mb-md">Upload image</div>
    <vv-input-file
      v-model="file"
      name="input-file"
      modifiers="drop-area square hidden"
      accept=".gif,.jpg,.jpeg,.png,image/gif,image/jpeg,image/png"
    />
  </div>
  <div v-show="blurhash" class="h-150 col-span-2">
    <picture class="flex gap-md justify-center">
      <div>
        <div class="text-20 font-semibold mb-md">Blurhash</div>
        <canvas ref="canvas" class="w-150 h-150 block object-cover" />
      </div>
      <div>
        <div class="text-20 font-semibold mb-md">Image</div>
        <img
          v-if="image"
          class="w-150 h-150 block object-cover"
          :class="{ 'vv-skeleton__item': isLoading }"
          :src="imageUrl"
          alt="image"
          :width="image.width"
          :height="image.height"
        />
      </div>
    </picture>
  </div>
</div>
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
- [x] (v0.0.10) Multiple uploads with `VvInputFile`;
- [x] (v0.0.10) `useBlurhash` composable;
- [ ] Image crop and file previews;
- [ ] Loaders with `VvLoader` and `VvSkeleton`;
- [ ] `VvTable` component with sort, filters, pagination and cell editing;
- [ ] Carousel and galleries with `VvCarousel` component;
- [ ] Calendar and date picker with `VvCalendar` component.

## Documentation

To learn more about `@volverjs/ui-vue`, check [its documentation](https://volverjs.github.io/ui-vue).

## License

[MIT](http://opensource.org/licenses/MIT)
