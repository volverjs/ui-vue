# Changelog

All notable changes to this project will be documented in this file.

## [0.0.21] - 2026-09-10

### Added

- `ariaLabel`, `ariaLabelledby` and `ariaDescribedby` on `VvCombobox`, `VvSelect`, `VvInputText` and `VvTextarea`, so a field can be named and described from outside. `label` is optional on every one of them, and until now a field drawn without one had no way to be named at all: the attribute a caller wrote landed on the block, where it named a wrapper nobody operates, and left the control the user reaches anonymous.

  They are declared props rather than attributes read out of `$attrs`, which is the other way to do it and the way `VvInputRange` does it. Declaring them is what moves them off the block, since Vue takes a declared prop out of `$attrs`, and it leaves the routing of everything else exactly as it was: `class`, `style` and the `data-` hooks a page puts on a field keep addressing the block. The call site does not change shape either, because Vue matches the kebab-case attribute to the camelCase prop, so `<VvSelect aria-label="Ward" />` reads the same here as it does on the slider.

  Note what this moves in the DOM: an application that already writes `aria-label` on one of these four components will find it on the control instead of on the block. It did nothing useful on the block, but a selector or a snapshot that expected it there needs updating.

  `aria-describedby` is the one of the three that does not override. It takes a list of ids, so a field with a hint of its own appends the hint to what the caller pointed at instead of dropping either, the caller's ids first, which is the order the two are read in. The list is not deduplicated, matching `VvInputRange`: a caller that includes the field's own hint id gets it announced twice.

  The two mechanisms now sit side by side, and they are not equivalent. `VvInputRange` forwards every `aria-` attribute to its control, these four forward exactly these three, so something like `aria-details` reaches the slider and stays on the block everywhere else.

### Fixed

- `VvAlert` and `VvCombobox` bound `aria-labelledby` unconditionally while the element carrying that id is conditional, so both pointed at an id that is not in the document whenever it was absent. A reference to a missing element names nothing, which left the control looking named while it was not: for `VvCombobox` that is a `role="combobox"`, which does require an accessible name, and for an `alertdialog` it hid that nothing named the dialog.

  On the alert the condition is a title and no `header` slot, which is the half that is easy to miss: the header slot replaces the whole default header, title included, so an alert with a custom header renders no title element even when `title` is set. The attribute moved out of `useVvAlert`'s `hasProps` and into the template for that reason, since whether a slot was passed is a render-time question and a computed does not track it.

  Neither was caught by the suite because every `Alert` story passes a title and every `Combobox` story passes a label, so the shape with neither was never drawn. Both now have a story that draws it, and the accessibility assertion in `Combobox.test.ts`, which had been commented out, runs again.

## [0.0.20] - 2026-09-07

### Fixed

- `VvInputRange` is dressed again. `@volverjs/style` moves to 0.1.26 among the development dependencies, the release that ships `vv-input-range`: 0.0.19 published the component while the style that draws it was still missing, and the styleguide rendered the field as a bare thumb sitting on no track.

  The failure is not the platform slider showing through. The reset of `@volverjs/style` applies `all: unset` to every element outside a short exclusion list, and `input[type="range"]` is not in it, so a control the library does not dress keeps no appearance of its own. The 0.0.19 entry said otherwise and is corrected there.

  The published package never carried the style, so what this release rebuilds is the styleguide, and an application already on 0.1.26 has nothing to do.
- The `@volverjs/style` peer dependency declares a floor for the first time, `>=0.1.26` in place of `>=0`. A component whose style is missing does not fail loudly, it renders undressed, and the changelog was the only place saying which release it needed. An application still on an older style now hears about it while installing rather than while looking at a slider with no track. Package managers configured to refuse unmet peers will hold the upgrade until `@volverjs/style` moves too, which is the intent: the two are one design system.
- A story asserts that the enabled slider computes `cursor: pointer`, which the dressed control sets and `all: unset` does not, so the suite fails if a component is ever released ahead of its style again.

## [0.0.19] - 2026-09-07

### Added

- `VvInputRange`, a slider for a numeric value between `min` and `max`, with the value picked shown next to it. It takes the props the other fields take (`name`, `label`, `disabled`, `readonly`, `valid`, `invalid`, `hintLabel`, `loading`, `modifiers`, `debounce`, `tabindex`, `autofocus`) and adds `min`, `max`, `step`, `defaultValue`, `showValue`, `unit` and `formatValue`, which localizes the readout without pulling an i18n library into the component. Slots are `before`, `value`, `after` and the hint family, and `flush()` is exposed as on `VvTextarea`, for a debounced value a custom submit has to read before its timer fires.

  A range input has no empty state: with no value of its own it reports the middle of its track, and a native form submits it. The field says the same, publishing that value on mount when the model is undefined, with `defaultValue` choosing it in place of the middle: a form model does not stay empty behind a field that already shows a number, and a schema that wants a number does not reject what the user is looking at. The value the component reports is always the one the thumb sits on, so a model out of range or off the step is clamped and snapped the way the native control does, and both the readout and the filled part of the track follow the slider rather than the model while a debounced drag waits for its timer.

  An `aria-` attribute the component does not declare reaches the slider instead of the block, `aria-label` above all, which is the accessible name of a field used without a visible label. Every other attribute keeps addressing the block, where `class`, `style` and the `data-` hooks a page puts on a field are expected to land.

  It takes no `readonly` attribute either, so `readonly` disables the native control and adds the `--readonly` modifier, the same shape `VvCheckbox`, `VvRadio` and `VvSelect` already use.

  CSS cannot read the value of a range input, so the component writes the filled share of the track on the block as `--input-range-progress`. It needs `@volverjs/style` 0.1.26, the release that ships `vv-input-range`. Not as a nicety: the reset of the style library unsets the user agent appearance of every control it does not dress itself, so without that release the field renders as a bare thumb with no track under it.
- `InputRange` in the json-render catalog and registry, which now declare 27 components.

### Changed

- Development dependencies updated, among them `storybook` and its addons to 10.6.0, `@antfu/eslint-config` to 9.5.1, `eslint` to 10.10.0, `playwright` to 1.63.0, `sass-embedded` to 1.104.0, `@iconify/utils` to 3.1.7 and `@types/node` to 26.4.1, and `packageManager` moves to pnpm 12.3.4.

  `vitest` and the two `@vitest/browser` packages join `typescript` in the reject list of `.ncurc.yml`: Vitest 5 is not supported by `@storybook/addon-vitest`, which peers on `vitest ^3 || ^4` up to and including its 11.0.0 alpha, and installing it makes the storybook project fail to import `.storybook/vitest.setup.ts`, so the suite collects its files and runs no test. They need no `overrides` entry, because nothing pulls vitest transitively.
- The three workflows pin `pnpm/action-setup` to the commit v6.1.0 points at. That is the first release which bootstraps pnpm 12, shipping as a native binary instead of the `@pnpm/exe` package the older path expects, and the floating `v6` tag still points at v6.0.10. The reference is a commit and not a tag because a tag can be moved under the workflow, which the analysis rates as a supply chain risk on a third party action.
- The styleguide workflow uploads the Pages artifact with `actions/upload-pages-artifact@v5`. Version 4 pins `actions/upload-artifact` 4.6.2 inside itself, which still targets Node.js 20, so every run of that job ended with the runner deprecation warning. It was the only one left in the pipeline. Version 5 is the same composite action with the pin moved to `actions/upload-artifact` 7, and it takes the same inputs.

## [0.0.18] - 2026-08-31

### Changed

- `VvInputFile` loads `vuedraggable` on demand instead of importing it at the top of the component. That package ships as a UMD bundle, so bundling it also resolves its `require('vue')`, which pulls in the CJS build of Vue with the template compiler inside. Every application importing anything at all from the components barrel paid for it, whether or not it ever rendered a file input: measured on a chat widget that has none, `vuedraggable`, `sortablejs`, `vue.cjs.prod.js` and `@vue/compiler-core` together weighed 77 kB gzipped of its initial payload, and they now leave the bundle entirely. Applications that do use `VvInputFile` load the sortable list from a separate chunk when the component mounts.
- Runtime dependencies updated: `@tanstack/vue-virtual` to 3.13.36 and `pica` to 10.0.3, both patch releases.
- Development dependencies updated, among them `storybook` and its addons to 10.5.10, `vite` to 8.2.2, `vitest` to 4.1.11, `eslint` to 10.9.1, `vue` to 3.5.42, `vue-tsc` to 3.3.11, `zod` to 4.5.4, `sass-embedded` to 1.103.1, `@json-render/core` and `@json-render/vue` to 0.20.0, and `pnpm` to 11.24.0. `typescript` stays on 6: the `overrides` block holds it back until Volar and typescript-eslint support the native compiler.
- Two new advisories on transitive development dependencies are closed through `overrides`: the `brace-expansion` floor moves to `^5.0.9`, because 5.0.8 is still open to the denial of service that bypasses the mitigation of CVE-2026-14257, and `nanoid` gains a `^3.3.18` floor, because the `postcss` resolved through `@vue/compiler-sfc` still installs 3.3.16. `pnpm audit` reports no vulnerabilities again. Neither package is reachable from the published bundle.

## [0.0.17] - 2026-08-03

### Added

- `VvDropdown` new prop `topLayer`: the floating element is promoted to the top layer through the Popover API, so it is no longer trapped by the stacking context of an ancestor nor clipped by its `overflow`. `strategy: fixed` alone does not help: a `position: fixed` element still belongs to the nearest ancestor stacking context, so an ancestor with a `z-index` (a sliding panel, a sticky toolbar) paints over the dropdown whatever `z-index` the dropdown declares. The popover is created as `manual`, so light dismiss and escape handling stay with the component, and browsers without the Popover API keep rendering the dropdown in flow. It implies `strategy: fixed`, because an element in the top layer is positioned against the viewport, and with it the `animationFrame` update of floating-ui, since the dropdown stops moving with the scroll of an ancestor.
- `VvCombobox`, `VvInputText` and `VvTextarea` expose `topLayer` too, and forward it to the dropdown they own.

  `topLayer` needs `@volverjs/style` >= 0.1.25, which ships the `popover` state on `vv-dropdown`: it neutralizes the user agent styles applied to `[popover]` elements, which would otherwise give the promoted dropdown the user agent border, padding and background. The development dependency moves to that version, so the stories and the tests run against it.

- `docs/specs/floating-elements.md` documents why a floating element is trapped by the stacking context of its ancestors, and the findings collected around it: the label-only option filter, the option list kept in the DOM while the dropdown is closed, the plugin defaults being a static snapshot read through two different paths, the hardcoded English labels, the suggestions dropdown duplicated between `VvInputText` and `VvTextarea`, and the `absolute` default strategy.

### Changed

- The three icon sets (`normal`, `simple`, `detailed`) are regenerated: same 200/199/199 icons, a handful of paths shortened by the newer `svgo` (a no-op `h0` dropped, a curve written as its shorthand). Equivalent shapes, smaller payload. They were committed out of sync with what the generator produces, which also left the working tree dirty after every build.
- Development dependencies updated, and the vulnerable transitive ones raised through `overrides`: `pnpm audit` goes from 28 advisories (1 critical, 17 high) to none. `npm-run-all` is gone, it was declared but no script used it, and it was the only thing pulling the critical `shell-quote`. Nothing here is reachable from the published package.
- The release workflows no longer break on their own build output: the version bump uses `npm pkg set` instead of `pnpm version`, which refuses to run on an unclean working tree, and the install keeps the lockfile frozen so a stale one fails the pull request rather than the release.

### Fixed

- `VvInputFile`: the `labelDownload` default said `Downlaod file`, and it is used as the `title` of the download button.

## [0.0.16] - 2026-07-29

### Fixed

- `VvInputText` and `VvTextarea` now commit the model synchronously when no `debounce` is set. `useDebouncedInput` always went through a `setTimeout`, so anything handled in the same task as the keystroke (a click on a submit button, an Enter, a step change in a multi-step form) read the previous value: the last thing typed was either lost or applied after the consumer had already moved on.
- `VvInputText` and `VvTextarea` flush a pending debounced value when the field loses focus, and `VvInputText` also on Enter, instead of dropping it. The value added to the suggestions history is now the final one.
- `VvInputText` and `VvTextarea` read the `debounce` prop reactively: it was captured once during setup, so changing it at runtime had no effect.
- `useDebouncedInput` clears a pending timer when its scope is disposed, so it can no longer emit `update:modelValue` after the component is gone (the emit landed on whatever the parent rendered next).

### Added

- `VvTab` new prop `lazy` to control panel rendering: `false` (default) renders every panel eagerly, `true` renders only the currently active panel, `'once'` renders a panel on first activation and keeps it mounted afterwards.
- `VvInputText` and `VvTextarea` expose `flush()`, to commit a debounced value on demand before reading the model (custom submit, programmatic validation). It returns the committed value, because the emit is synchronous while the prop only comes back on the next parent render.

## [0.0.15] - 2026-06-17

### Fixed

- `useDefaults`: component defaults declared as an array of prop types (e.g. `type: [String, Number]`) are now matched and applied correctly; previously only single-type definitions were honored.
- Object comparison by dotted field path (`equals(a, b, 'a.b.c')` via `resolveFieldData`) no longer throws when an intermediate property is `null`/`undefined`, and returns safely instead.
- `VvInputFile`: `formatBytes` (exposed through the `file-list` and `file-item` slots) now honors an explicit `decimals = 0` instead of falling back to `2`.
- Dropdown and `v-contextmenu` scroll-container lookup (`findScrollContainer`) now guards DOM globals and is safe in non-browser/SSR environments.
- `isDateIsoString` now validates strictly against the canonical UTC form produced by `toISOString()`, aligning the regex pre-check with the equality check.
- `useBlurhash`: image load failures now reject with an `Error` instead of a raw event-arguments array.

### Changed

- `AlertModifier` and `NavItem.on` keys keep their literal autocomplete suggestions while still accepting any string.
- Internal code-quality cleanup addressing SonarCloud findings (`readonly` members, `globalThis` usage, `Set`-based lookups, optional chaining, reduced cognitive complexity in `deepEquals`/`useDefaults`/`VvInputText`). No public behavior changes.

## [0.0.14] - 2026-06-16

### Fixed

- TypeScript declarations (`.d.ts`) were missing from the published package. The `dist` clean step introduced in `0.0.13` ran inside `scripts/build.js`, _after_ `generate-tsd` had emitted the declarations, deleting them before the Vite bundles were generated. Cleaning now runs as a separate `clean` step before `generate-tsd`, so declarations are preserved (fixes `Could not find a declaration file for module '@volverjs/ui-vue/...'`).

## [0.0.13] - 2026-06-16

### Added

- `useVirtualScroll` composable for virtualized lists.
- `VvVirtualScroll` component built on `useVirtualScroll`.
- `VvInputFile` new prop `hidePreview` to hide the file preview.
- `VvInputFile` new scoped slots `drop-area`, `file-list`, and `file-item` for better customization and control.
- `VvInputText` now exposes `$input` and `$wrapper` refs in addition to `$inner`.
- `VvInputText` new prop `suggestions` to provide external suggestions (storage-based suggestions are removable, external ones are permanent).

- **Generative UI**: json-render catalog and registry (`@volverjs/ui-vue/json-render`) enabling LLMs to generate UIs using Volver components.
  - `catalog` — Pre-built `defineCatalog` with 26 curated components (layout, data display, actions, navigation, forms) and Zod-validated props.
  - `registry` — Pre-built `defineRegistry` mapping catalog types to Vue components.
  - `volverComponentDefinitions` — Individual Zod component definitions for building custom catalogs.
  - `volverComponents` — Individual registry component entries for building custom registries.
  - Form components integrate with `$bindState` two-way binding via `useBoundProp`.
- New export entry: `./json-render`.

### Changed

- `package.json` `main`/`module` now point to the generated `index` bundles, added `sideEffects: false` and `src` to published `files`.
- Build now cleans the `dist` folder before running.

### Fixed

- `VvDropdown` applied the `offset` middleware twice.
- `VvTextarea`/`VvInputText` countdown counter returned a ref instead of its value and now counts past the upper limit.
- `Volver.fetchIcon` now throws on HTTP errors instead of returning the error body.
- `useBlurhash` `encode` failed with `pica` v10 and leaked the created object URL.
- Memory leaks: `VvAccordion` event bus listener and `VvAlert` auto-close timer were not cleared on unmount.
- `VvCombobox` searchable dropdown closed prematurely on iOS Safari (focus briefly moves to `document.body` during transitions), preventing search; collapse on focus loss is now debounced.
- Floating-UI option types leaked a non-portable `Derivable` callback variant into the generated type declarations, breaking declaration emit (TS2883).

## [0.0.12] - 2025-11-02

### Added

- `VvCombobox` new slot `option-group` for customizing group labels.

### Changed

- Updated dependencies to latest versions.

### Fixed

- `VvCombobox` option groups filtering and selection handling.

## [0.0.11] - 2025-10-02

### Fixed
- Dependencies upgrade to fix `@iconify/tools` security issue in `axios` package.

## [0.0.10] - 2025-09-23

### Added

- `useBlurhash` composable;
- `VvInputFile` component; 
- `VvAction` prop for `current` class;
- `VvNavItem` and `VvNavSeparator` components;
- Inner types export;
- `VvCombobox` events `update:search` and `update:options`;
- `VvInputText` suggestions;
- Storage selection for `VvAccordionGroup` persistence;
- Scoped slot for items in `VvNav` and `VvTab`;
- added `storageKey` and `storageType` props to `VvTextarea` for suggestions;
- `VvCombobox` and `VvSelect` prop `autoselectFirst` to automatically select the first option when the dropdown is opened;
- `VvCombobox` and `VvSelect` prop `showClearAction` to show a clear action button when there is a value selected;
- `VvCombobox` new prop `addable` to allow adding new items;
- `VvCombobox` new prop `keepSearch` to retain the search input value when the dropdown is closed;
- `VvInputText` add support for iso date format and date object for type `date`, `datetime-local`, `time` and `month`;
- `--watch` flag for `generate-icons` script;
- `--keepColors` flag for `generate-icons` script;
- Replace `ts-dot-prop` with `dot-prop` for deprecation.

### Deprecated

- Event `change:search` on `VvCombobox` (use `update:search`);
- `VvCombobox` prop `unselectable` (use `minValues` instead).

### Changed

- `@volverjs/ui-vue/directives` now exports `vTooltip` and `vContextmenu` directives instead of `tooltip` and `contextmenu`;
- `VvAccordionGroup` prop for storage key `storeKey` is now `storageKey`.
- Align `VvNav` items prop with `VvAction` props;
- Align `VvTab` items prop with `VvAction` and `VvNav` props;
- Replace `uid` with `useId` from `vue`;

### Fixed

- `VvCombobox` keep an array `modelValue` also with `multiple: false`;
- `VvCombobox` focus state;
- `VvTextarea` focus state;
- `v-tooltip` directive update on props change;
- `VvInputText` force type number on stepUp/stepDown;
- Removed `target` prop validation;
- Improved `VvCombobox` support for object values;
- Nuxt compatibility.

## [0.0.9] - 2023-08-30

### Fixed

- `VvCombobox` close label;
- `VvCombobox` badge remove button with type `button`;
- `VvCombobox` default dropdown transition and modifier;
- `VvDropdown` no default modifiers;
- `VvDialog` catch escape keydown event with `keepOpen: true`;
- `VvDialog` triggers `showModal()` and `close()` only if element has `open` attribute;
- `VvDropdown` animation frame update with `strategy: 'fixed'`.

### Changed

- `maska` has been replaced by `vue-imask` in `VvInputText`;
- `mask`, `maskEager`, `maskReversed`, `maskTokens` and `maskTokensReplace` props in `VvInputText` are now `iMask` object.

### Added

- Default props by global plugin configuration for input components;
- Emit of transition events on `VvDialog` and `VvDropdown`;
- `useAlert` to manage alerts, story and test;
- `VvCombobox` custom search function;
- `VvInputText` add `select-on-focus` prop to select all text on focus.

## [0.0.8] - 2023-05-22

### Added

- `VvAlert` new `title` and `close` slots;
- `VvDropdown` `VvCombobox` mobile management;
- Allow dot notation on props `labelKey`, `valueKey`, `disabledKey` in components `VvSelect`, `VvCombo`, `VvRadioGroup`, `VvCheckboxGroup`.

### Fixed

- `focus()` with `preventScroll: true`;
- `VvDropdown` arrow placement;
- `VvCombobox` select option on key "enter".

## [0.0.7] - 2023-05-12

### Fixed

- `VvCombobox` and `VvDropdown` space keydown event.

## [0.0.6] - 2023-05-11

### Added

- `VvAvatar` and `VvAvatarGroup` components and test;
- `VvNav` component and test;
- `VvTab` component and test;
- `VvButton` custom `value` and `unncheckedValue` when it's used as `toggle`;
- `VvAlert` and `VvAlertGroup` components and test.

### Fixed

- Some props types issues;
- `VvButtonGroup` modifiers are now merged with the child modifiers;
- `VvDialog` now uses `showModal()` and `close()` dialog functions;
- `VvInputText`, `VvTextarea`, `VvSelect`, `VvCombobox`, `VvCheckbox` and `VvRadio` hint slots.

### Changed

- `autoClose:true` is now `keepOpen` for `VvCombobox`, `VvDropdown` and `VvDialog`.

### Upgrade

- dev dependencies:

  - `storybook@7.0.0-beta.40` to `storybook@7.0.10` stable version
  - `eslint-plugin-vue`to `v9.12.0`
  - `glob` to `v7.2.3`
  - `terser` to `v5.17.3`
  - `@vitejs/plugin-vue` to `v4.2.2`
  - `@vue/compiler-sfc` to `v3.3.1`

- dependencies:
  - `@volverjs/style` to `v0.1.10`
  - `vue` to `v3.3.1`

## [0.0.5] - 2023-03-29

### Added

- `VvAccordionGroup` and `VvAccordion` support for `not` property to invert the state (closed are in v-model and open are not);
- First test of `useDefaults` composable in `VvCombobox` for globally defined default labels;
- `VvDropdownOption` hint label (deselect, select, selected, etc.);
- `VvDropdown` support for `fixed` strategy;
- `VvInputText` mask and unit;
- `v-contextmenu` directive.

### Fixed

- `VvDropdownAction` label;
- Typescript definitions;
- Enum in PropType;
- `autoClose` prop in `VvCombobox` for single choice.
- `VvAccordionGroup`, `VvButtonGroup` and `VvCheckboxGroup` and `VvRadioGroup` disabled and readonly.
- `VvInputText` and `VvTextarea` support for string `minlength` and `maxlength`.

## [0.0.4] - 2023-02-03

### Added

- `VvAction` component for buttons, anchors, RouterLinks and NuxtLinks;
- `VvDropdownAction` component for dropdown menu items;
- `VvDropdownOption` component for combobox options;
- `VvCombobox` no options message and no options slot;
- `VvCombobox` no search results message and no search results slot;
- unplugin resolver for directives.

### Fixed

- Build script with auto import;
- Now @volverjs/style is a dependency.

## [0.0.3] - 2023-02-01

### Added

- `VvTooltip` component and `v-tooltip` directive.

### Fixed

- Redesign of `VvCombobox` for better accessibility and more flexibility;
- Rewrite of `VvDropdown`, now is applicable to any element with `@floating-ui/vue`.

## [0.0.2] - 2023-01-18

### Added

- `VvCombobox` support for floating label, unselectable items and native select;
- `VvSelect` support for floating label, unselectable items, and multiple selection;
- `VvDropdown` support for unselectable items;
- `VvInputText` autofocus is triggered on element visibility;
- `VvTextarea` autofocus is triggered on element visibility;
- `VvSelect` autofocus is triggered on element visibility.

### Fixed

- `VvButtonGroup` itemModifiers now are merged with the child modifiers;
- `VvInputText` and `VvTextarea` count without maxlength;
- unplugin resolver fix for `VvCombobox`.

## [0.0.1] - 2023-01-17

### Added

- `VvAccordion` component;
- `VvAccordionGroup` component;
- `VvBadge` component;
- `VvBreadcrumb` component;
- `VvButton` component;
- `VvButtonGroup` component;
- `VvCard` component;
- `VvCheckbox` component;
- `VvCheckboxGroup` component;
- `VvCombobox` component;
- `VvDialog` component;
- `VvDropdown` component;
- `VvIcon` component;
- `VvInputText` component;
- `VvProgress` component;
- `VvRadio` component;
- `VvRadioGroup` component;
- `VvSelect` component;
- `VvTextarea` component;
- `VvRadioGroup` component.

[0.0.18]: https://github.com/volverjs/ui-vue/compare/v0.0.17...v0.0.18
[0.0.17]: https://github.com/volverjs/ui-vue/compare/v0.0.16...v0.0.17
[0.0.16]: https://github.com/volverjs/ui-vue/compare/v0.0.15...v0.0.16
[0.0.15]: https://github.com/volverjs/ui-vue/compare/v0.0.14...v0.0.15
[0.0.14]: https://github.com/volverjs/ui-vue/compare/v0.0.13...v0.0.14
[0.0.13]: https://github.com/volverjs/ui-vue/compare/v0.0.12...v0.0.13
[0.0.12]: https://github.com/volverjs/ui-vue/compare/v0.0.11...v0.0.12
[0.0.11]: https://github.com/volverjs/ui-vue/compare/v0.0.10...v0.0.11
[0.0.10]: https://github.com/volverjs/ui-vue/compare/v0.0.9...v0.0.10
[0.0.9]: https://github.com/volverjs/ui-vue/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/volverjs/ui-vue/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/volverjs/ui-vue/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/volverjs/ui-vue/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/volverjs/ui-vue/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/volverjs/ui-vue/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/volverjs/ui-vue/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/volverjs/ui-vue/compare/v0.0.1...v0.0.2
