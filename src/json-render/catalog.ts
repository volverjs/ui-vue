import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/vue'
import { volverComponentDefinitions } from './definitions'

/**
 * Pre-built json-render catalog containing all 26 curated Volver UI components.
 *
 * Use this catalog to generate a system prompt for AI models and validate
 * generated specs against the Volver component library.
 *
 * @example
 * ```ts
 * import { catalog } from '@volverjs/ui-vue/json-render'
 *
 * // Generate a system prompt for your AI model
 * const systemPrompt = catalog.prompt()
 *
 * // With custom rules
 * const systemPrompt = catalog.prompt({
 *   customRules: [
 *     'Always use Card as the root element for page sections',
 *     'Group related form inputs in a Card with a descriptive title',
 *     'Use Alert with modifiers=success/warning/danger for feedback messages',
 *   ],
 * })
 * ```
 */
export const catalog = defineCatalog(schema, {
    components: volverComponentDefinitions,
    actions: {},
})
