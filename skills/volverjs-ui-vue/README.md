# Volver UI Vue Skill for Claude Code

Agent skill that helps Claude Code build interfaces with [Volver UI Vue](https://github.com/volverjs/ui-vue), the Vue 3 component library based on `@volverjs/ui-vue`.

## Installation

```bash
npx skills add volverjs/ui-vue
```

This adds the skill to your Claude Code configuration.

## What This Skill Covers

The skill is specialized for real Volver UI Vue implementation patterns:

- **Components**: VvButton, VvInputText, VvSelect, VvCombobox, VvDialog, VvDropdown, VvCheckbox, VvRadio, VvTab, VvAlert, VvTooltip, VvVirtualScroll, and more.
- **Shared Props**: loading, validation, disabled state, icon support, options mapping, debounce, clearable inputs, floating labels.
- **Group Patterns**: VvButtonGroup, VvCheckboxGroup, VvRadioGroup, VvAccordionGroup state coordination.
- **BEM Modifiers**: `modifiers` prop usage aligned with `@volverjs/style` classes.
- **Plugin Setup**: Volver plugin registration, defaults, icons collections/providers, directives, aliases, and experimental features.
- **Auto-Import**: resolver setup via `@volverjs/ui-vue/resolvers/unplugin`.
- **Composables**: `useAlert`, dropdown composables, `useBlurhash`, `useVirtualScroll`, `useVolver`.
- **JSON Render**: catalog/registry usage to support AI-generated UIs from validated JSON.

## Usage

Once installed, Claude Code should automatically use this skill when you ask to:

- Build forms, dialogs, dropdowns, tabs, alerts, or navigation with Volver components.
- Configure Volver plugin options in a Vue app.
- Compose groups and shared validation/loading patterns.
- Use Volver composables or JSON Render integration.

### Example Prompts

```text
Create a login form with VvInputText, VvCheckbox, and a loading VvButton using Volver UI Vue.
```

```text
Set up VolverPlugin with global defaults, custom icon collection, and tooltip/contextmenu directives.
```

```text
Build a searchable VvCombobox with custom option slot and async search debounce.
```

```text
Show how to render a confirmation modal with VvDialog and footer action buttons.
```

```text
Generate a JSON Render example using the Volver catalog and registry.
```

## Source of Truth

When coding, verify APIs directly from the library source:

- `src/components/Vv<Name>/Vv<Name>.vue`
- `src/props/index.ts`
- `src/types/`
- `src/constants.ts`
- `src/json-render/`

## Documentation

- [Volver UI Vue Repository](https://github.com/volverjs/ui-vue)
- [Skill Specification](./SKILL.md)

## License

MIT