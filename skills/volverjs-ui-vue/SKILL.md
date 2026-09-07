---
name: volverjs-ui-vue
description: |
  Build Vue 3 interfaces with @volverjs/ui-vue, the component library of the Volver design system (paired with @volverjs/style for CSS). Covers the 35 Vv components with their real prop, slot and event names, shared props, BEM modifiers, group components, options mapping, icons, plugin setup, auto-import resolver, composables and the json-render catalog for AI-generated UI.
  Use this skill whenever a project depends on @volverjs/ui-vue or renders Vv-prefixed components (VvButton, VvInputText, VvCombobox, VvDialog, VvDropdown, VvAlert, VvTab, VvNav, VvCard, VvInputRange...), even when the user only says "form", "modal", "select", "dropdown menu", "tabs", "notifications" or "the design system" without naming the library. Also use it when contributing to the ui-vue library itself, when configuring VolverPlugin or VolverResolver, when writing useAlert/useDropdownContextmenu code, and when generating UI from JSON with the Volver catalog.
---

# @volverjs/ui-vue

Vue 3 component library of the Volver design system. Components are unstyled shells that emit BEM
classes (`vv-button`, `vv-button--primary`, `vv-button__label`); the CSS comes from `@volverjs/style`.
The single most common mistake when writing Volver code is guessing a prop name (`clearable`,
`floatingLabel`, `iconPosition="left"`...). Prop names here are specific and the library does not warn
on unknown props, so a wrong name fails silently at runtime. Verify before writing.

## 1. Source of truth: read the code, not your memory

The package ships its `src/` folder, so the same paths work in the library repo and in any project
that installed it (prefix with `node_modules/@volverjs/ui-vue/` in the latter):

| What | Where |
|------|-------|
| Props with JSDoc, events | `src/components/Vv<Name>/index.ts` (`VvNavItem`/`VvNavSeparator` are in `VvNav/`, `VvDropdown*` in `VvDropdown/`) |
| Slots, scope and dynamic modifiers | `src/components/Vv<Name>/Vv<Name>.vue` |
| Shared prop objects (`ClearProps`, `IconProps`, `DropdownProps`...) | `src/props/index.ts` |
| Enums (`Side`, `Placement`, `Position`, `ButtonType`...) | `src/constants.ts` |
| Working examples for every component | `src/stories/<Name>/*.stories.ts` |
| Plugin, icons, resolver, composables, json-render | `README.md` of the package |
| Which modifiers exist per component | `node_modules/@volverjs/style/src/settings/components/_vv-<name>.scss`, key `modifier` |

Fast path, from the project root. The scripts live in the `scripts/` folder next to this file and
locate the package on their own:

```bash
sh scripts/inspect-component.sh VvCombobox VvDialog   # props, events, slots, stories
sh scripts/list-modifiers.sh vv-button                 # valid modifiers, from @volverjs/style
```

Run the inspect script for every component you are about to use for the first time in a session. It
is cheaper than debugging a silent prop mismatch.

## 2. Component catalog (35 components)

**Form controls**: `VvInputText` (types text, password, number, email, tel, url, color, search, date,
time, datetime-local, month, week; iMask masking, suggestions, step actions, password toggle, clear
action, unit, count), `VvTextarea`, `VvInputRange` (slider with `min`/`max`/`step`, `showValue`,
`unit`, `formatValue`), `VvInputFile` (drop area, preview, sortable, progress), `VvSelect` (native
select, optgroups, `multiple`), `VvCombobox` (dropdown select: `searchable`, `multiple`, `addable`,
`badges`, async `searchFunction`, `native` fallback), `VvCheckbox` (binary or array mode, `switch`,
`indeterminate`), `VvRadio`, `VvCheckboxGroup`, `VvRadioGroup`.

**Actions**: `VvAction` (renders `button`, `a`, `router-link` or `nuxt-link` from `href`/`to`),
`VvButton` (extends VvAction: `label`, `icon`, `loading`, `toggle`/`value`), `VvButtonGroup`
(`toggle`, `multiple`, shared `modelValue`).

**Display**: `VvCard` (`title`, slots header/default/content/footer), `VvBadge` (`value`), `VvAvatar`
(`imgSrc`), `VvAvatarGroup` (`items`, `toShow`, `totalItems`), `VvProgress` (`value`, `max`,
required `label`), `VvIcon` (`name`, `prefix`, `provider`), `VvAlert`, `VvAlertGroup`, `VvTooltip`
(CSS-only, `value` + `position`).

**Navigation**: `VvNav` (`items: NavItem[]`), `VvNavItem`, `VvNavSeparator`, `VvBreadcrumb`
(`routes: NavItem[]`), `VvTab` (`items: NavItemTab[]`, `panel::<tab>` slots, `lazy`).

**Overlays and containers**: `VvDialog` (native `<dialog>`, top layer), `VvDropdown` (Floating UI,
`topLayer` opt-in) with `VvDropdownAction`, `VvDropdownItem`, `VvDropdownOption`,
`VvDropdownOptgroup`, `VvAccordion` (`<details>`), `VvAccordionGroup`, `VvVirtualScroll`
(@tanstack/vue-virtual).

## 3. Shared props: the names that actually exist

Most components spread these objects from `src/props/index.ts`. Learn the exact names.

| Concern | Props | Notes |
|--------|-------|-------|
| Identity | `id`, `name` | `name` is **required** on every input, checkbox, radio, select, combobox, file and on the groups |
| Label and hint | `label`, `hintLabel`, `placeholder` | hint family slots: `hint`, `loading`, `valid`, `invalid` |
| Validation | `valid`, `validLabel`, `invalid`, `invalidLabel` | labels accept a string or an array of strings |
| State | `disabled`, `readonly`, `required`, `loading`, `loadingLabel` | |
| Icon | `icon`, `iconPosition` | position is `before` or `after` (enum `Position`), never left/right |
| Floating label | `floating` | not `floatingLabel` |
| Clear action | `showClearAction`, `iconClear`, `labelClear` | not `clearable` |
| Count | `count` = `true`, `'limit'` or `'countdown'` | with `maxlength` |
| Debounce | `debounce` (ms) | input, textarea, range |
| Options | `options`, `labelKey`, `valueKey`, `disabledKey` | see section 6 |
| Links | `to`, `href`, `target`, `rel` | on VvAction, VvButton, nav items, breadcrumb routes |
| BEM | `modifiers` | string (space separated) or string array |
| Floating UI | `placement`, `strategy`, `offset`, `shift`, `flip`, `autoPlacement`, `arrow`, `size`, `keepOpen`, `autofocusFirst`, `triggerWidth`, `topLayer`, `transitionName` | VvDropdown and VvCombobox |

## 4. Modifiers: the class is free, the style is not

`modifiers="primary rounded"` produces `vv-button--primary vv-button--rounded`. Any string is accepted,
but only the modifiers declared by `@volverjs/style` do anything. Components also add dynamic ones on
their own (`--disabled`, `--icon-only`, `--reverse`, `--floating`, `--valid`, `--invalid`,
`--readonly`), so do not pass those by hand.

Declared by `@volverjs/style` 0.1.25 (regenerate with `scripts/list-modifiers.sh` when the version changes):

| Component | Modifiers |
|-----------|-----------|
| vv-button | `primary` `secondary` `danger` `ghost` `link` `action` `action-quiet` `static-light` `static-dark` `rounded` `block` `full-bleed` |
| vv-button-group | `block` `vertical` `compact` |
| vv-alert | `success` `danger` `warning` `info` `accent` `brand` `notification` `callout` `nowrap` |
| vv-alert-group | `stack` `reverse` `fixed` `absolute` `top-start` ... `bottom-end` `full-bleed` |
| vv-badge | `sm` `rounded` `outline` `ghost` `action` `white` `black` `gray` `danger` `success` `warning` `info` `accent` |
| vv-avatar | `rounded` `square` `bordered` `ring` `md` `lg` `transparent` `surface` `gray` `danger` `success` `warning` `info` `accent` |
| vv-avatar-group | `tight` `relaxed` |
| vv-card | `glass` |
| vv-dialog | `small` `fullscreen` |
| vv-dropdown | `rounded` `block` `full-bleed` `dialog` `mobile` |
| vv-accordion | `bordered` `square` `marker-right` |
| vv-accordion-group | `condensed` |
| vv-checkbox-group | `horizontal` |
| vv-input-file | `drop-area` `square` `circle` `hidden` `with-progress` |
| vv-textarea | `resizable` |
| vv-nav | `sidebar` `aside` `tabs` `full` |
| vv-tooltip | `visible` `top` `bottom` `left` |
| vv-breadcrumb | `multiline` |

Default button (no modifier) is the brand color. There is no `large`/`small` on buttons: sizing comes
from utility classes of `@volverjs/style` (see the `volverjs-style` skill when available).

## 5. Icons: the design system ships its own set

`VvIcon` wraps Iconify. The plugin registers the Volver collections under provider `vv` with prefixes
`normal` (default), `detailed` and `simple`, each with about 200 icons. A bare name resolves inside
those collections:

```vue
<VvIcon name="search" />                 <!-- @vv:normal:search -->
<VvIcon name="search" prefix="simple" /> <!-- @vv:simple:search -->
<VvButton icon="trash" modifiers="danger" label="Delete" />
<VvInputText name="q" icon="search" icon-position="after" label="Search" />
```

Names that exist in the bundled set include `add`, `edit`, `trash`, `close`, `search`, `check`,
`check-circle`, `warning`, `error`, `information`, `calendar`, `time`, `email`, `phone`, `user`,
`home`, `settings`, `download`, `upload`, `copy`, `filter`, `menu`, `more-vertical`,
`chevron-down/up/left/right`, `arrow-down/up/left/right`, `eye-on`, `eye-off`, `lock`, `unlock`,
`external-link`, `star`, `heart`, `bell`, `logout`, `login`, `reload`, `image`, `file`, `pdf`.
List the full set with `node -e "console.log(Object.keys(require('@volverjs/ui-vue/src/assets/icons/normal.json').icons).join(' '))"`.

A name with an Iconify prefix (`mdi:home`) falls through to the public Iconify API and is fetched
over the network at runtime. Do not use it in a design-system project unless the user asks for it;
prefer the bundled names or a custom collection generated with the package's `generate-icons` bin
(see `src/components/VvIcon/README.md`).

## 6. Core patterns

### Links and buttons: VvAction decides the tag

`disabled` forces `<button>`; `to` renders `router-link` (or `nuxt-link` with the plugin's `nuxt`
option); `href` renders `<a>`; otherwise `defaultTag` (button). VvButton, VvNavItem, VvBreadcrumb
items and VvDropdownAction all follow this rule, so a menu entry becomes a link by adding `to`.

```vue
<VvButton label="Save" modifiers="primary" type="submit" :loading="saving" />
<VvButton :to="{ name: 'home' }" icon="home" label="Home" modifiers="ghost" />
<VvButton href="https://example.com" target="_blank" icon="external-link" icon-position="after" label="Docs" />
<VvButton icon="trash" aria-label="Delete" modifiers="action-quiet" />   <!-- icon-only: no label, no default slot -->
```

Slots: `default` (replaces the whole inner content), `before`, `label`, `after`, `loading`.

### Groups: the parent owns the state

Children read `modelValue`, `disabled`, `readonly`, `valid`/`invalid` (inputs) or `toggle`,
`multiple`, `modifiers` (buttons) from the group through provide/inject. Set those on the group, not
on the children. Groups need a `name`.

```vue
<VvButtonGroup v-model="view" toggle :item-modifiers="'secondary'">
  <VvButton value="list" icon="view-list" label="List" />
  <VvButton value="grid" icon="grid" label="Grid" />
</VvButtonGroup>

<VvCheckboxGroup v-model="channels" name="channels" label="Notify me by"
  :options="[{ label: 'Email', value: 'email' }, { label: 'SMS', value: 'sms' }]"
  :invalid="!channels.length" invalid-label="Pick at least one" />

<VvRadioGroup v-model="plan" name="plan" vertical>
  <VvRadio name="plan" value="free" label="Free" />
  <VvRadio name="plan" value="pro" label="Pro" />
</VvRadioGroup>

<VvAccordionGroup v-model="openSection">          <!-- one open at a time unless `collapse` -->
  <VvAccordion name="a" title="Shipping">...</VvAccordion>
  <VvAccordion name="b" title="Returns">...</VvAccordion>
</VvAccordionGroup>
```

A standalone `VvCheckbox` bound to a boolean needs both values, otherwise the unchecked state is
`undefined`: `<VvCheckbox v-model="agree" name="agree" :value="true" :unchecked-value="false" label="I agree" switch />`.

### Options: strings or objects, keys as path or function

`VvSelect`, `VvCombobox`, `VvCheckboxGroup`, `VvRadioGroup` share `OptionsProps`. Default keys are
`label`, `value`, `disabled`. Keys accept a dot path (`'meta.id'`) or a function
`(option) => string`. An option with an `options` array becomes an optgroup.

```vue
<VvSelect v-model="fruit" name="fruit" label="Fruit" :options="['Apple', 'Banana']" />
<VvCombobox v-model="userId" name="user" label="User" :options="users"
  label-key="fullName" value-key="id" disabled-key="inactive" searchable show-clear-action />
<VvCombobox v-model="tags" name="tags" label="Tags" :options="allTags" multiple badges addable />
```

`VvCombobox` emits `update:search` (use `v-model:search`), debounced by `debounceSearch`; pass a
`searchFunction` for async filtering. It renders a `VvSelect` when `native` is true. Slots:
`option` (`{ option, selectedOptions, selected, disabled }`), `option-group`, `value`,
`placeholder`, `no-results`, `no-options`, `dropdown::before`, `dropdown::after`, `before`, `after`
and the hint family.

### Dropdown: trigger in the default slot, entries in `#items`

The first `VvAction`/`VvButton` inside the default slot registers itself as the Floating UI
reference and gets `aria-expanded`. Menus use `VvDropdownAction` (an action, so `to`/`href` work);
listboxes use `VvDropdownOption` with `role="listbox"`.

```vue
<VvDropdown v-model="open" placement="bottom-end" top-layer>
  <VvButton icon="more-vertical" aria-label="Actions" modifiers="action-quiet" />
  <template #items="{ hide }">
    <VvDropdownAction @click="edit(); hide()"><VvIcon name="edit" /> Edit</VvDropdownAction>
    <VvDropdownAction :to="{ name: 'detail', params: { id } }"><VvIcon name="view" /> Open</VvDropdownAction>
    <VvDropdownAction @click="remove(); hide()"><VvIcon name="trash" /> Delete</VvDropdownAction>
  </template>
</VvDropdown>
```

`VvDropdownAction` takes the action props (`label`, `to`, `href`, `disabled`...) but no `icon`: put a
`VvIcon` in its slot.

Use `top-layer` when the trigger sits inside a panel with its own stacking context (sticky header,
transformed card), otherwise the menu is painted underneath (`docs/specs/floating-elements.md`).
For a right-click menu use `useDropdownContextmenu` or the `v-contextmenu` directive.

### Tabs and navigation: items arrays, panel slots

```vue
<VvTab v-model="tab" :items="[{ label: 'Profile', tab: 'profile' }, { label: 'Billing', tab: 'billing' }]" lazy="once">
  <template #panel::profile>...</template>
  <template #panel::billing>...</template>
</VvTab>

<VvNav modifiers="sidebar" :items="[{ label: 'Home', to: '/' }, { label: 'Docs', href: '/docs', current: true }]" />
<VvBreadcrumb :routes="[{ label: 'Home', to: '/' }, { label: 'Orders' }]" />
```

`NavItem` fields: `label`, `to`, `href`, `target`, `rel`, `title`, `ariaLabel`, `disabled`,
`current`, `class`, `on` (event handlers), `data` (passed to the `item` slot).

### Alerts: a reactive list rendered by VvAlertGroup

```vue
<script setup lang="ts">
import { useAlert } from '@volverjs/ui-vue/composables'
const { alerts, addAlert, removeAlert } = useAlert()   // no arguments, module-level state
function saved() {
  addAlert({ title: 'Saved', content: 'Your changes are live.', modifiers: 'success', autoClose: 5000 })
}
</script>
<template>
  <VvAlertGroup name="default" :items="alerts" position="fixed" block="top" inline="end" @close="removeAlert" />
</template>
```

`addAlert` accepts the `Alert` type (`id`, `title`, `content`, `footer`, `icon`, `modifiers`,
`dismissable`, `autoClose`, `closeLabel`, `role`) plus `group` for a second list; read another
group with `getAlerts('name')`. Standalone `<VvAlert>` takes the same props plus slots `header`,
`title`, `title::before`, `title::after`, `close`, `default`, `footer`. The `info` icon is the
default; `success`/`warning`/`danger` pick their icon from the modifier.

### Dialog and card

```vue
<VvDialog v-model="confirmOpen" title="Delete order?" modifiers="small">
  <p>This cannot be undone.</p>
  <template #footer>
    <VvButton label="Cancel" modifiers="secondary" @click="confirmOpen = false" />
    <VvButton label="Delete" modifiers="danger" :loading="deleting" @click="destroy" />
  </template>
</VvDialog>

<VvCard title="Invoice">
  <template #content>...</template>
  <template #footer><VvButton label="Download" icon="download" modifiers="secondary" /></template>
</VvCard>
```

`VvDialog` is a native `<dialog>` opened with `showModal()`: `Esc` and click outside close it unless
`keepOpen`; it emits `open`, `close` and the transition hooks. The `header` slot replaces title and
close button together. `VvCard` puts the default slot straight into the article; `content` and
`footer` add the wrapped sections.

## 7. Setup

Three ways to bring components in; do not mix them in the same project without a reason.

1. **Explicit imports** (tree-shakable): `import { VvButton } from '@volverjs/ui-vue/components'`
   or `import VvButton from '@volverjs/ui-vue/vv-button'`, plus the style
   `import '@volverjs/style/vv-button'` (or `@volverjs/style/scss/vv-button`).
2. **Global registration** through the plugin `components` option.
3. **Auto-import** with `unplugin-vue-components`:

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { VolverResolver } from '@volverjs/ui-vue/resolvers/unplugin'
Components({ resolvers: [VolverResolver({ importStyle: 'scss', directives: true })] })
// options: importStyle (false | 'css' | 'scss'), directives, prefix ('vv'), ignore: string[], cherryPick
```

The plugin is always needed for icons and defaults:

```ts
import { VolverPlugin } from '@volverjs/ui-vue'
import iconsCollections from '@volverjs/ui-vue/icons'
import { vTooltip, vContextmenu } from '@volverjs/ui-vue/directives'
import '@volverjs/style/base'

app.use(VolverPlugin, {
  iconsCollections,                              // IconifyJSON[]; add your own generated collections here
  iconsProvider: 'vv',                           // default
  nuxt: false,                                   // true makes `to` render <nuxt-link>
  components: { VvButton, VvInputText },         // optional global registration
  aliases: { BtnDanger: VvButton },              // extra names for the same component
  defaults: {                                    // default props per component name or alias
    VvInputText: { floating: true, debounce: 300 },
    BtnDanger: { modifiers: 'danger' },
  },
  directives: { tooltip: vTooltip, contextmenu: vContextmenu },
  fetchWithCredentials: false, fetchOptions: undefined,   // for fetchIcon()
  experimentalFeatures: { forceInputSuggestions: false },
})
```

`defaults` are baked into the prop definitions of components registered through `components` and
`aliases`. The form components (`VvInputText`, `VvTextarea`, `VvSelect`, `VvCombobox`, `VvCheckbox`,
`VvRadio`, the two groups, `VvInputFile`, `VvInputRange`) also read them at runtime, so their
defaults work with explicit imports and auto-import too; for `VvButton`, `VvDialog` and the rest they
apply only to globally registered components. The instance is available as `$vv` in templates.

## 8. Composables (`@volverjs/ui-vue/composables`)

| Composable | Signature | Use |
|-----------|-----------|-----|
| `useAlert()` | returns `{ alerts, groups, addAlert, removeAlert, getAlerts }` | notifications, see section 6 |
| `useDropdownContextmenu(dropdownRef, targetEl?)` | `Ref<VvDropdown>`, optional element | open a dropdown at the pointer on right click |
| `useDropdownVirtualElement(dropdownRef)` | `Ref<VvDropdown>` | anchor a dropdown to arbitrary coordinates |
| `useBlurhash()` | returns `{ encode, decode, loadImage }` | blurred image placeholders |
| `useVirtualScroll({ scrollEl, count, estimateSize, getItemKey?, overscan?, horizontal? })` | | custom virtual lists; `VvVirtualScroll` covers the common case |

Directives: `v-tooltip="'text'"` and `v-tooltip:top="'text'"` (argument is the `Side`),
`v-contextmenu`. Import from `@volverjs/ui-vue/directives`.

## 9. Generative UI (json-render)

`@volverjs/ui-vue/json-render` exports `catalog` (27 Zod-validated component definitions),
`registry` (mapping to the real components), plus `volverComponentDefinitions` and
`volverComponents` to build a subset. Peer dependencies: `@json-render/core`, `@json-render/vue`,
`zod`. Form components support `$bindState` for two-way binding.

```ts
import { catalog, registry } from '@volverjs/ui-vue/json-render'
const systemPrompt = catalog.prompt({ customRules: ['Use the primary modifier for the main call to action'] })
// <Renderer :spec="spec" :registry="registry" /> inside StateProvider and VisibilityProvider from @json-render/vue
```

The package `README.md` has the full rendering and custom-catalog examples.

## 10. Before you finish: the checklist that catches real bugs

- Every input, select, combobox, checkbox, radio, file and group has a `name`.
- No invented props: `floating` not `floatingLabel`, `showClearAction` not `clearable`,
  `iconPosition` is `before`/`after`, `imgSrc` on avatars, `routes` on breadcrumbs, `items` on
  nav/tab/accordion group, `labelClose` on dialogs, `closeLabel` on alerts.
- Every modifier you wrote appears in the table of section 4 (or in `list-modifiers.sh` output).
- Icons use bundled names or a registered collection, not random Iconify prefixes.
- Boolean checkboxes have `:value="true" :unchecked-value="false"`.
- Dropdowns inside sticky/transformed containers have `top-layer`.
- Alerts go through `useAlert` and one `VvAlertGroup` with `:items` and `@close`.
- For anything not covered here, you ran `inspect-component.sh` and read the story instead of guessing.
