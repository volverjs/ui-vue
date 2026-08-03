# Floating elements: layering and follow-ups

> **Status**: Partial. #1 is mitigated by the `topLayer` prop, #2 is fixed in `@volverjs/style`. Everything else is open.
> **Date**: 2026-07-31
> **Scope**: Findings collected while investigating a `VvCombobox` dropdown painted under a fixed application header. The root cause is #1, but reading the surrounding code brought up a set of independent issues on the dropdown, the option list and the plugin defaults. Each one is described with the evidence, the impact and a proposal, so they can be picked up separately.
> **Related**: [volverjs/style#98](https://github.com/volverjs/style/pull/98), released in `@volverjs/style` 0.1.25 (the z-index scale and the `[popover]` reset), [volverjs/ui-vue#156](https://github.com/volverjs/ui-vue/pull/156) (the `topLayer` prop)

---

## Overview

`VvDropdown` renders its floating element inline, as a sibling of the trigger, and positions it with floating-ui. That is a deliberate choice with real advantages (the tab order matches the reading order, styles inherited from the ancestors keep working, it survives a shadow root), but it has one consequence that no `z-index` can work around: the dropdown belongs to the stacking context of its ancestors.

The reported symptom was a combobox inside a sliding settings panel: the panel is `position: absolute` with a `z-index`, the application header sits at `--z-fixed`, and the dropdown was painted below the header. `strategy: fixed` does not help, because it takes the element out of the flow, not out of the stacking context. `VvDialog` never had the problem, and the reason is instructive: `<dialog>.showModal()` promotes it to the top layer.

The other findings are unrelated to layering, they simply surfaced along the way.

---

## 1. Floating elements are trapped in the stacking context of their ancestors

**What happens.** Any ancestor that creates a stacking context (a `position` plus a `z-index`, a `transform`, a `filter`, `will-change`) confines the dropdown. Inside that context the dropdown can declare any `z-index` it wants: the comparison that decides whether it covers the header happens between the ancestor and the header, not between the dropdown and the header.

**Evidence.** [`VvDropdown.vue`](../../src/components/VvDropdown/VvDropdown.vue), the floating element is a plain `div` inside the component template, with no `Teleport` and no top layer. There is not a single `Teleport` in `src/`. It affects every consumer of `VvDropdown`: `VvCombobox`, `VvInputText` and `VvTextarea` suggestions, and the menus built directly on it.

**Impact.** Sliding panels, sticky toolbars and animated cards are common layouts, and in each of them the dropdown of a component the application does not control is painted underneath. The workaround is to raise the whole ancestor above the header, which is invasive and has to be repeated in every application.

**Status.** Mitigated by the `topLayer` prop, opt-in: the floating element gets `popover="manual"` and is promoted to the top layer, where neither the stacking context nor the `overflow` of the ancestors applies. Two things are left:

- make it the default in the next major, keeping the in-flow rendering as the escape hatch. Baseline support for the Popover API has been there since 2024 (Chrome 114, Safari 17, Firefox 125) and the feature detection already falls back on its own.
- `VvTooltip` has the same confinement for a different reason: it is CSS only, positioned with modifier classes, and sits at `--z-tooltip`. The value is high enough, the context still traps it. It needs the same promotion, which means giving it a floating element it can promote.

## 2. The z-index scale placed the dropdown below the application chrome

**What happens.** `--z-dropdown` was `1000`, the lowest of the overlay levels, below `--z-sticky` (`1010`) and `--z-fixed` (`1020`), while `--z-popover` (`1070`) and `--z-tooltip` (`1080`) were already above them. So even with no stacking context in the way, a dropdown anchored to a fixed header could not cover it.

**Evidence.** `$z-index` in `@volverjs/style`, `src/settings/_layout.scss`.

**Status.** Fixed in `@volverjs/style` 0.1.25 ([volverjs/style#98](https://github.com/volverjs/style/pull/98)): `--z-dropdown` moves to `1025`, between `--z-fixed` and `--z-modal-backdrop`. The same release adds the `popover` state that neutralizes the user agent styles of `[popover]` elements, which `topLayer` depends on, so that is the minimum version for #1.

## 3. The option filter only matches the label

**What happens.** The default filter of `VvCombobox` searches `getOptionLabel(option)` and nothing else. When the label is a translated or decorated string, the option cannot be found by its own value, which is usually the identifier the user knows from the API or the documentation.

**Evidence.** [`VvCombobox.vue`](../../src/components/VvCombobox/VvCombobox.vue), `filteredOptions`.

**Impact.** Every application that needs a broader match has to pass a `searchFunction`, reimplementing tokenization and case folding, and loses the grouping logic the built-in filter already handles.

**Proposal.** A `searchKeys` prop, defaulting to the label key, so `['label', 'value']` is one line instead of a custom function. The current `searchFunction` stays as the escape hatch for remote search.

## 4. The whole option list stays in the DOM while the dropdown is closed

**What happens.** The floating element is toggled with `v-show`, so options are rendered on mount and kept in the DOM for the entire lifetime of the component, whether the dropdown is ever opened or not.

**Evidence.** [`VvDropdown.vue`](../../src/components/VvDropdown/VvDropdown.vue), `v-show="expanded"` on the floating element.

**Impact.** A form with a handful of comboboxes over a few dozen options each renders hundreds of nodes nobody looks at, plus their icons and slots. It is also the reason a `VvDropdown` is not free to mount.

**Proposal.** A `lazy` prop with the semantics `VvTab` already ships (`false` renders eagerly, `true` renders only while expanded, `'once'` renders on first expand and keeps it mounted). Reusing the same three values keeps the API consistent across the library.

## 5. Plugin defaults are a static snapshot, and there are two of them

**What happens.** The defaults passed to `VolverPlugin` are read twice, through two different paths:

- `useDefaultProps` rewrites the `props.default` of the component at registration time, from the object passed to `install` ([`Volver.ts`](../../src/Volver.ts));
- `useDefaults` reads `volver.defaults.value[componentName]` inside a computed, which is reactive ([`useDefaults.ts`](../../src/composables/useDefaults.ts)).

An application that reassigns `volver.defaults.value` therefore updates one path and not the other, and the values themselves are plain values: they cannot be getters or refs.

**Impact.** This bites on i18n. The natural way to localize the defaults is `searchPlaceholder: t('placeholder.search')` at install time, which captures the language active on boot: switch language at runtime and the labels of every component stay in the initial one. There is no declarative way out, only reassigning the ref from a watcher, which the globally registered components then ignore.

**Proposal.** Accept `MaybeRefOrGetter` as a default value and resolve it in `useDefaults` with `toValue`, so `searchPlaceholder: () => t('placeholder.search')` follows the locale. Then have a single source of truth: either drop the `useDefaultProps` rewrite, or feed it from the same reactive store.

## 6. Default labels are hardcoded English strings

**What happens.** Twenty-five user-visible strings are declared as English defaults across the components: `'Search...'`, `'No results'`, `'No options available'`, `'Press enter to select'`, `'Press enter to remove'`, `'Selected option not found'`, `'Remove suggestion'`, `'Show password'`, `'Loading...'` and so on.

**Evidence.** `default: '...'` in `src/components/*/index.ts` and in [`src/props/index.ts`](../../src/props/index.ts).

**Impact.** A non-English application has to override every one of them, one by one, and #5 makes those overrides insensitive to a runtime language change. Anything missed shows up in production in the wrong language, in a `title` or an `aria` attribute where it is easy to overlook.

**Proposal.** Keep the English strings as the fallback, but document them as one set and make them overridable in one place, which is #5. A locale bundle shipped with the library, opt-in through the plugin, would go further and is worth a separate discussion.

While listing them, one turned out to be a typo: `labelDownload` defaulted to `'Downlaod file'` and lands in the `title` of the download button of `VvInputFile`. Fixed along with this spec.

## 7. `VvInputText` and `VvTextarea` duplicate the suggestions dropdown

**What happens.** Both components declare the same `VvDropdown` block for suggestions, with the same props (`reference`, `autofocus-first`, `trigger-width`, and now `top-layer`), the same `VvDropdownOption` loop, the same remove button and the same slot contract.

**Evidence.** [`VvInputText.vue`](../../src/components/VvInputText/VvInputText.vue) and [`VvTextarea.vue`](../../src/components/VvTextarea/VvTextarea.vue), the `hasSuggestions` blocks.

**Impact.** Every change to the suggestions has to be made twice, and it is easy to make it once. Adding `top-layer` was exactly that: the same edit in two files.

**Proposal.** Extract an internal `VvSuggestionsDropdown` component (not exported), owning the dropdown, the options and the remove action, with the two components passing values and slots through. It also gives the suggestions their own stories and tests, which today only exist through the two hosts.

## 8. The default positioning strategy is `absolute`

**What happens.** `strategy` defaults to `undefined`, so floating-ui uses `absolute` and the coordinates are relative to the offset parent. Tracking is not the issue: `autoUpdate` observes the scroll of the overflow ancestors and repositions. Clipping is: an absolutely positioned element is clipped by the `overflow` of its ancestors, so a dropdown taller than the panel hosting it gets cut off. `fixed` avoids that clipping, without being a cure for everything: it does not leave the stacking context (#1), and an ancestor with a `transform`, a `filter` or `will-change` becomes its containing block, which brings the clipping back.

**Evidence.** `strategy` in [`src/props/index.ts`](../../src/props/index.ts), `DropdownProps`.

**Impact.** Applications discover this one dropdown at a time and end up setting `strategy: 'fixed'` in the plugin defaults, meaning the shipped default is the one nobody wants. `topLayer` already forces `fixed`, because in the top layer there is no offset parent to position against.

**Proposal.** Consider `fixed` as the default in the next major. It costs an `animationFrame` update in `autoUpdate`, which is the price already paid by every application that sets it by hand today.
