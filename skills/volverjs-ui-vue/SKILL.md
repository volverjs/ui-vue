---
name: volverjs-ui-vue
description: |
  Build Vue 3 UIs with @volverjs/ui-vue. Covers components, props, slots, composables, plugin setup, BEM modifiers, group patterns, JSON Render, and auto-import.
  Use when users ask for forms, pages, layouts, dialogs, dropdowns, alerts, navigation, icons, or any Vv-prefixed component (for example VvButton, VvInputText, VvSelect, VvDialog, VvCombobox, VvCard, VvTooltip, VvVirtualScroll).
  Trigger on @volverjs/ui-vue mentions, Volver components, plugin/defaults configuration, group components, options mapping, and JSON-rendered UI generation.
---

# @volverjs/ui-vue — Component Library Skill

This skill helps you build UIs using @volverjs/ui-vue, a Vue 3 component library with 34 components, composables, directives, and a JSON Render system for AI-driven UI generation.

The library is paired with `@volverjs/style` for CSS (BEM convention). Components are designed for composability via shared props, group patterns, and slot architecture.

## Quick Reference

Before writing any code, check the actual component source for the latest props and slots:
- Components live in `src/components/Vv<Name>/Vv<Name>.vue`
- Shared props are defined in `src/props/index.ts`
- Types are in `src/types/`
- Constants/enums in `src/constants.ts`

When in doubt, **read the component source file** — it's the canonical reference.

## Component Catalog

### Form Controls
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `VvInputText` | Text input (text, password, email, date, color, search, etc.) | Input masking (iMask), debounce, suggestions, password toggle, count, clear action, floating label |
| `VvTextarea` | Multi-line text | Count support (limit/countdown), debounce |
| `VvSelect` | Native select | Multiple mode, option groups, generic `<T>`, clear action |
| `VvCombobox` | Searchable select with dropdown | Async search, multi-select, addable options, grouped options, badges display, virtual scroll |
| `VvCheckbox` | Checkbox | Binary/group mode, indeterminate, switch variant |
| `VvRadio` | Radio button | Group integration |
| `VvInputFile` | File upload | Drag-drop, preview, resize (pica) |
| `VvCheckboxGroup` | Checkbox container | Shared modelValue, valid/invalid state propagation |
| `VvRadioGroup` | Radio container | Same as CheckboxGroup |

### Presentation
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `VvButton` | Action button | Toggle mode, icon support, loading state, group integration |
| `VvCard` | Article wrapper | Slots: header, content, footer |
| `VvBadge` | Status indicator | Inline badge with modifiers |
| `VvAvatar` | User avatar | Image with fallback |
| `VvAvatarGroup` | Avatar collection | Grouped display |
| `VvProgress` | Progress bar | Determinate/indeterminate |
| `VvIcon` | Iconify icon | Provider-based icon system |
| `VvButtonGroup` | Button container | Shared toggle, multiple selection, unselectable |

### Layout & Navigation
| Component | Purpose |
|-----------|---------|
| `VvBreadcrumb` | Breadcrumb item |
| `VvNav` | Navigation container |
| `VvNavItem` | Navigation item (extends VvAction) |
| `VvNavSeparator` | Navigation separator |
| `VvTab` | Tab panel |

### Overlays
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `VvDialog` | Modal dialog | Native `<dialog>`, transitions, click-outside close, keepOpen |
| `VvDropdown` | Floating popover | Floating UI positioning, keyboard nav, focus management |
| `VvTooltip` | Tooltip | Floating UI, directive alternative (`v-tooltip`) |
| `VvAlert` | Notification | Dismissable, auto-close, role-based ARIA |
| `VvAlertGroup` | Alert container | Event bus for close coordination |

### Advanced
| Component | Purpose |
|-----------|---------|
| `VvAccordion` | Collapsible section (details/summary) |
| `VvAccordionGroup` | Mutual exclusivity container |
| `VvVirtualScroll` | Virtual scrolling (@tanstack/vue-virtual) |
| `VvAction` | Base action (button/link abstraction) |

## Core Patterns

### 1. BEM Modifiers

Every component supports `modifiers` prop for BEM styling. Modifiers generate CSS classes like `vv-button--primary`.

```vue
<!-- Single modifier -->
<VvButton modifiers="primary">Save</VvButton>
<!-- output class: vv-button vv-button--primary -->

<!-- Multiple modifiers (space-separated string or array) -->
<VvButton :modifiers="['primary', 'large']">Save</VvButton>
<!-- output class: vv-button vv-button--primary vv-button--large -->
```

Dynamic modifiers are added internally by components (e.g. `--disabled`, `--reverse`, `--icon-only`). The available modifier values depend on `@volverjs/style` — check the style library for valid modifiers per component.

### 2. Group Pattern

Groups synchronize state across child components. The child automatically reads from the group's state instead of its own props when nested inside a group.

```vue
<!-- ButtonGroup: toggles with single selection -->
<VvButtonGroup v-model="selected" toggle>
  <VvButton value="a">Option A</VvButton>
  <VvButton value="b">Option B</VvButton>
  <VvButton value="c">Option C</VvButton>
</VvButtonGroup>

<!-- CheckboxGroup: shared validation state -->
<VvCheckboxGroup v-model="choices" :invalid="hasError" invalid-label="Select at least one">
  <VvCheckbox value="email" label="Email" />
  <VvCheckbox value="sms" label="SMS" />
</VvCheckboxGroup>

<!-- AccordionGroup: mutual exclusion (only one open at a time) -->
<VvAccordionGroup>
  <VvAccordion title="Section 1">Content 1</VvAccordion>
  <VvAccordion title="Section 2">Content 2</VvAccordion>
</VvAccordionGroup>
```

### 3. Action Component (VvAction)

`VvAction` is the base for clickable elements. It renders as `<button>`, `<a>`, `<router-link>`, or `<nuxt-link>` based on props. VvButton, VvNavItem, and VvBreadcrumb all extend it.

```vue
<!-- Renders as <button> -->
<VvAction label="Click me" />

<!-- Renders as <a> -->
<VvAction href="https://example.com" label="Visit" />

<!-- Renders as <router-link> -->
<VvAction :to="{ name: 'home' }" label="Home" />
```

### 4. Shared Props

Components compose their props from shared prop objects. Knowing these helps predict what a component accepts:

- **LinkProps**: `to`, `href`, `target`, `rel` — navigation
- **ValidProps / InvalidProps**: `valid`, `validLabel` / `invalid`, `invalidLabel` — validation feedback
- **LoadingProps**: `loading`, `loadingLabel` — loading state
- **DisabledProps**: `disabled` — disabled state
- **IconProps**: `icon`, `iconPosition` (before/after) — icon display
- **ModifiersProps**: `modifiers` — BEM classes
- **HintProps**: `hintLabel` — hint text
- **OptionsProps**: `options`, `labelKey`, `valueKey`, `disabledKey` — option lists
- **CountProps**: `count` (true | 'limit' | 'countdown') — character counting
- **DebounceProps**: `debounce` (ms) — input debounce
- **ClearProps**: `clearable`, `clearIcon`, `clearLabel` — clear action
- **FloatingLabelProps**: `floatingLabel` — floating label style
- **DropdownProps**: `placement`, `strategy`, `offset`, `shift`, `flip`, etc. — Floating UI positioning

### 5. Options Pattern

For VvSelect, VvCombobox, VvCheckboxGroup, VvRadioGroup — options can be simple strings or objects:

```vue
<!-- Simple string options -->
<VvSelect :options="['Apple', 'Banana', 'Cherry']" v-model="fruit" />

<!-- Object options with custom keys -->
<VvSelect
  :options="users"
  label-key="fullName"
  value-key="id"
  disabled-key="isInactive"
  v-model="selectedUser"
/>

<!-- Nested dot-path keys -->
<VvSelect
  :options="items"
  label-key="meta.displayName"
  value-key="meta.id"
  v-model="selectedItem"
/>

<!-- Function keys for computed values -->
<VvSelect
  :options="items"
  :label-key="(item) => `${item.name} (${item.code})`"
  :value-key="(item) => item.id"
  v-model="selectedItem"
/>
```

### 6. Slot Architecture

Components expose named slots for customization. Common patterns:

```vue
<VvButton>
  <template #before>🔒</template>
  <template #label>Custom Label</template>
  <template #after>→</template>
</VvButton>

<VvCard>
  <template #header>Card Title</template>
  <template #content>Main content</template>
  <template #footer>
    <VvButton modifiers="primary">Action</VvButton>
  </template>
</VvCard>

<VvDialog v-model="isOpen" title="Confirm">
  <template #default>Are you sure?</template>
  <template #footer>
    <VvButton @click="isOpen = false">Cancel</VvButton>
    <VvButton modifiers="primary" @click="confirm">OK</VvButton>
  </template>
</VvDialog>

<VvCombobox :options="users" v-model="selected">
  <template #option="{ option }">
    <VvAvatar :src="option.avatar" /> {{ option.name }}
  </template>
  <template #no-results>No users found</template>
</VvCombobox>
```

### 7. Icon System

Icons use Iconify. Register collections via the Volver plugin, then reference by name:

```vue
<VvIcon name="mdi:home" />
<VvButton icon="mdi:save" modifiers="primary">Save</VvButton>
<VvInputText icon="mdi:search" icon-position="before" />
```

### 8. Directives

```vue
<!-- Tooltip directive -->
<button v-tooltip="'Helpful tip'">Hover me</button>

<!-- Context menu directive -->
<div v-contextmenu="menuHandler">Right-click me</div>
```

## Plugin Setup

```typescript
import { createApp } from 'vue'
import { VolverPlugin } from '@volverjs/ui-vue'
import type { VolverOptions } from '@volverjs/ui-vue'

// Icon collections (optional)
import customIcons from './icons'

const app = createApp(App)

app.use(VolverPlugin, {
  // Auto-register components (enables <VvButton> in templates without importing)
  components: { VvButton, VvDialog, VvInputText },

  // Global prop defaults per component
  defaults: {
    VvButton: { modifiers: 'primary' },
    VvInputText: { floatingLabel: true, debounce: 300 }
  },

  // Icon configuration
  iconsCollections: [customIcons],
  iconsProvider: 'vv',

  // Fetch options for icon HTTP requests
  fetchWithCredentials: true,

  // Directives
  directives: { tooltip: vTooltip, contextmenu: vContextmenu },

  // Aliases
  aliases: { Btn: VvButton },

  // Experimental
  experimentalFeatures: { forceInputSuggestions: true }
} satisfies VolverOptions)
```

### Auto-Import (unplugin-vue-components)

```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { VolverResolver } from '@volverjs/ui-vue/resolvers/unplugin'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        VolverResolver({
          prefix: 'vv',
          importStyle: 'scss',  // or 'css'
          directives: true,
          cherryPick: false     // true for individual component imports
        })
      ]
    })
  ]
})
```

## Composables

Five exported composables for advanced use:

| Composable | Purpose |
|-----------|---------|
| `useAlert()` | Add/remove alerts in an AlertGroup programmatically |
| `useDropdownContextmenu()` | Attach a dropdown as context menu to an element |
| `useDropdownVirtualElement()` | Position dropdown on a virtual/computed element |
| `useBlurhash()` | Generate blurhash placeholder images |
| `useVirtualScroll()` | Manage virtual scroll state |

Access the Volver instance in composables via `useVolver()`.

## JSON Render System

The JSON Render system lets AI models generate UIs from JSON definitions. It provides a Zod-validated catalog of all components with their props and slots.

For detailed JSON Render usage, read `src/json-render/index.ts` and `src/json-render/catalog.ts`. Key concepts:

```typescript
import { catalog, registry } from '@volverjs/ui-vue/json-render'

// Generate an LLM system prompt describing available components
const prompt = catalog.prompt({ customRules: ['Use primary buttons for CTAs'] })

// Use the registry with @json-render/vue <Renderer> component
```

Components support `$bindState` for two-way binding in JSON render mode.

## Common Recipes

### Login Form
```vue
<template>
  <form @submit.prevent="handleLogin">
    <VvInputText
      v-model="email"
      type="email"
      label="Email"
      floating-label
      icon="mdi:email"
      icon-position="before"
      required
      :invalid="errors.email"
      :invalid-label="errors.email"
    />
    <VvInputText
      v-model="password"
      type="password"
      label="Password"
      floating-label
      icon="mdi:lock"
      icon-position="before"
      required
      :invalid="errors.password"
      :invalid-label="errors.password"
    />
    <VvCheckbox v-model="rememberMe" label="Remember me" switch />
    <VvButton type="submit" modifiers="primary" :loading="isLoading">
      Login
    </VvButton>
  </form>
</template>
```

### Confirmation Dialog
```vue
<template>
  <VvDialog v-model="showConfirm" title="Delete Item?">
    <p>This action cannot be undone.</p>
    <template #footer>
      <VvButton @click="showConfirm = false">Cancel</VvButton>
      <VvButton modifiers="danger" @click="handleDelete" :loading="deleting">
        Delete
      </VvButton>
    </template>
  </VvDialog>
</template>
```

### Searchable Select
```vue
<template>
  <VvCombobox
    v-model="selectedUser"
    v-model:search="searchQuery"
    :options="users"
    label-key="fullName"
    value-key="id"
    label="Select User"
    floating-label
    clearable
    :debounce-search="300"
  >
    <template #option="{ option }">
      <VvAvatar :src="option.avatar" modifiers="small" />
      <span>{{ option.fullName }}</span>
    </template>
    <template #no-results>
      No users match "{{ searchQuery }}"
    </template>
  </VvCombobox>
</template>
```

### Alert Notifications
```vue
<template>
  <VvAlertGroup name="notifications" />
</template>

<script setup>
import { useAlert } from '@volverjs/ui-vue/composables'

const { add } = useAlert('notifications')

function showSuccess(message: string) {
  add({
    title: 'Success',
    content: message,
    modifiers: 'success',
    dismissable: true,
    autoClose: 5000
  })
}
</script>
```

## Important Conventions

1. **Always check component source** for the latest props — read `src/components/Vv<Name>/Vv<Name>.vue`
2. **BEM modifiers** depend on `@volverjs/style` — not all modifier strings are valid for all components
3. **Group components** propagate state downward — child props are overridden by group state when nested
4. **VvAction** is the base for links/buttons — use `href`/`to` for links, nothing for buttons
5. **Options** support string paths, functions, or simple strings for flexible data binding
6. **Floating UI** positioning is handled by VvDropdown/VvTooltip — configure via `placement`, `offset`, `shift`, `flip` props
7. **Transitions** on VvDialog and VvDropdown emit lifecycle events (beforeEnter, afterLeave, etc.)
