# Changelog

All notable changes to this project will be documented in this file.

## [0.0.10] - 2023-12-18

### Added

- `useBlurhash` composable;
- `VvInputFile` component;
- `VvAction` prop for `current` class;
- `VvNavItem` and `VvNavSeparator` components;
- Inner types export;
- `--watch` flag for `generate-icons` script;
- `VvCombobox` event `update:search`;
- `VvInputText` suggestions;
- Storage selection for `VvAccordionGroup` persistence;
- Scoped slot for items in `VvNav` and `VvTab`.

### Deprecated

- Event `change:search` on `VvCombobox` (use `update:search`).

### Changed

- `@volverjs/ui-vue/directives` now exports `vTooltip` and `vContextmenu` directives instead of `tooltip` and `contextmenu`;
- `VvAccordionGroup` prop for storage key `storeKey` is now `storageKey`.

### Fixed

- `VvCombobox` keep an array `modelValue` also with `multiple: false`;
- `VvCombobox` focus state;
- `VvTextarea` focus state;
- `v-tooltip` directive update on props change;
- `VvInputText` force type number on stepUp/stepDown;
- Removed `target` prop validation;
- Improved `VvCombobox` support for object values.

### Changed

- Align `VvNav` items prop with `VvAction` props;
- Align `VvTab` items prop with `VvAction` and `VvNav` props;

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

[0.0.10]: https://github.com/volverjs/style/compare/v0.0.9...v0.0.10
[0.0.9]: https://github.com/volverjs/style/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/volverjs/style/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/volverjs/style/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/volverjs/style/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/volverjs/style/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/volverjs/style/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/volverjs/style/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/volverjs/style/compare/v0.0.1...v0.0.2
