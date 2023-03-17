# Changelog

All notable changes to this project will be documented in this file.

## [0.0.5] - 2023-02-20

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
- `VvInputText`and `VvTextarea` support for string `minlength`and `maxlength`.

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

[0.0.5]: https://github.com/volverjs/style/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/volverjs/style/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/volverjs/style/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/volverjs/style/compare/v0.0.1...v0.0.2
