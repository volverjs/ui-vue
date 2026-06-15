/**
 * json-render catalog and registry for @volverjs/ui-vue
 *
 * Enables LLMs to generate UIs using Volver components by following
 * the json-render standard (https://json-render.dev).
 *
 * ## Quick start
 *
 * ```ts
 * import { catalog, registry } from '@volverjs/ui-vue/json-render'
 *
 * // 1. Generate AI system prompt
 * const systemPrompt = catalog.prompt()
 *
 * // 2. Use registry to render AI-generated specs
 * // <Renderer :spec="spec" :registry="registry" />
 * ```
 *
 * ## Custom catalog (subset of components)
 *
 * ```ts
 * import { defineCatalog } from '@json-render/core'
 * import { schema } from '@json-render/vue'
 * import { volverComponentDefinitions } from '@volverjs/ui-vue/json-render'
 *
 * const myCatalog = defineCatalog(schema, {
 *   components: {
 *     Button: volverComponentDefinitions.Button,
 *     Card: volverComponentDefinitions.Card,
 *     InputText: volverComponentDefinitions.InputText,
 *   },
 * })
 * ```
 *
 * ## Custom registry (subset of components)
 *
 * ```ts
 * import { defineRegistry } from '@json-render/vue'
 * import { volverComponents } from '@volverjs/ui-vue/json-render'
 *
 * const { registry } = defineRegistry(myCatalog, {
 *   components: {
 *     Button: volverComponents.Button,
 *     Card: volverComponents.Card,
 *     InputText: volverComponents.InputText,
 *   },
 * })
 * ```
 */

// Pre-built catalog & registry (ready to use)
export { catalog } from './catalog'
export { volverComponents } from './components'

// Individual component implementations (for selective imports)
export {
    AccordionComponent,
    AccordionGroupComponent,
    // Data Display
    AlertComponent,
    AlertGroupComponent,
    AvatarComponent,
    AvatarGroupComponent,
    BadgeComponent,
    // Navigation
    BreadcrumbComponent,
    // Actions
    ButtonComponent,
    ButtonGroupComponent,
    // Layout
    CardComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    ComboboxComponent,
    DialogComponent,
    IconComponent,
    InputFileComponent,
    // Forms
    InputTextComponent,
    NavComponent,
    ProgressComponent,
    RadioComponent,
    RadioGroupComponent,
    SelectComponent,
    TabComponent,
    TextareaComponent,
    TooltipComponent,
} from './components'
// Building blocks (for custom catalogs / registries)
export { volverComponentDefinitions } from './definitions'

// Individual definitions (for selective imports)
export {
    AccordionDefinition,
    AccordionGroupDefinition,
    // Data Display
    AlertDefinition,
    AlertGroupDefinition,
    AvatarDefinition,
    AvatarGroupDefinition,
    BadgeDefinition,
    // Navigation
    BreadcrumbDefinition,
    // Actions
    ButtonDefinition,
    ButtonGroupDefinition,
    // Layout
    CardDefinition,
    CheckboxDefinition,
    CheckboxGroupDefinition,
    ComboboxDefinition,
    DialogDefinition,
    IconDefinition,
    InputFileDefinition,
    // Forms
    InputTextDefinition,
    NavDefinition,
    ProgressDefinition,
    RadioDefinition,
    RadioGroupDefinition,
    SelectDefinition,
    TabDefinition,
    TextareaDefinition,
    TooltipDefinition,
} from './definitions'

export { registry } from './registry'
