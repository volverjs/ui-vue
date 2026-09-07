# Volver UI Vue skill for Claude Code

Agent skill that teaches Claude Code to build interfaces with [@volverjs/ui-vue](https://github.com/volverjs/ui-vue), the Vue 3 component library of the Volver design system.

## Installation

```bash
npx skills add volverjs/ui-vue
```

## What the skill does

The library has specific prop names (`floating`, `showClearAction`, `iconPosition="before"`, a required `name` on every field) and Vue does not warn when a prop is misspelled, so a guessed name fails silently. The skill fixes that in two ways:

- **Verified reference in `SKILL.md`**: the 35 components, the shared props with their exact names, the BEM modifiers that `@volverjs/style` actually declares, the bundled icon set, the group/options/dropdown/tab/alert patterns, plugin and resolver setup, composables, json-render. Every snippet is checked against the library source.
- **Scripts that read the installed package** instead of relying on memory:
  - `scripts/inspect-component.sh VvCombobox` prints props with JSDoc, events, slots with their scope and the stories that show real usage.
  - `scripts/list-modifiers.sh vv-button` prints the modifiers defined by the installed `@volverjs/style`.

Both scripts work inside the library repository and inside any project that installed the package (it ships its `src/` folder).

## When it triggers

Any request involving `@volverjs/ui-vue` or `Vv*` components, also when the user just says "form", "modal", "dropdown menu", "tabs", "notifications" in a project that depends on the library. Also for `VolverPlugin`/`VolverResolver` configuration, `useAlert` and the other composables, and JSON-rendered UI with the Volver catalog.

### Example prompts

```text
Add a login form to LoginView.vue with email, password and a "remember me" switch, using the design system components.
```

```text
Set up VolverPlugin with our custom icon collection and floating labels by default on every VvInputText.
```

```text
Turn the actions column of this table into a VvDropdown menu with edit, open and delete entries.
```

```text
Show a success notification after the save call using the Volver alert system.
```

## Keeping it up to date

- New component or renamed prop: update the catalog and the shared props table in `SKILL.md`.
- New `@volverjs/style` release: run `scripts/list-modifiers.sh` and refresh the modifiers table (the version is noted above the table).

## License

MIT
