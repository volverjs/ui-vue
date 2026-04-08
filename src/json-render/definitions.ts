import { z } from 'zod'

/**
 * Individual component definitions for building custom json-render catalogs.
 * Each entry is a ready-to-use catalog definition with Zod-validated props,
 * declared slots, and a description for AI guidance.
 *
 * @example
 * ```ts
 * import { defineCatalog } from '@json-render/core'
 * import { schema } from '@json-render/vue'
 * import { volverComponentDefinitions } from '@volverjs/ui-vue/json-render'
 *
 * const myCatalog = defineCatalog(schema, {
 *   components: {
 *     Button: volverComponentDefinitions.Button,
 *     Card: volverComponentDefinitions.Card,
 *   },
 * })
 * ```
 */

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

const modifiers = z.union([z.string(), z.array(z.string())]).nullish()

const iconPosition = z.enum(['before', 'after']).nullish()

const labelValueOption = z.object({
    label: z.string(),
    value: z.union([z.string(), z.number(), z.boolean()]),
})

const navItem = z.object({
    label: z.string(),
    to: z.string().nullish(),
    href: z.string().nullish(),
})

/** Common form field props shared across input components. */
const formFieldProps = {
    name: z.string(),
    label: z.string().nullish(),
    required: z.boolean().nullish(),
    disabled: z.boolean().nullish(),
    modifiers,
} as const

// ---------------------------------------------------------------------------
// Layout & Container components
// ---------------------------------------------------------------------------

export const CardDefinition = {
    props: z.object({
        title: z.string().nullish(),
        modifiers,
    }),
    slots: ['default', 'header', 'footer'],
    description:
        'Container card with optional title. Use as a surface to group related content. Supports header, default, and footer slots.',
}

export const AccordionDefinition = {
    props: z.object({
        title: z.string(),
        content: z.string().nullish(),
        modifiers,
    }),
    slots: ['summary', 'default'],
    description:
        'Collapsible content section with a clickable summary header. Use for FAQ entries, expandable details, or progressive disclosure.',
}

export const AccordionGroupDefinition = {
    props: z.object({
        collapse: z
            .boolean()
            .nullish()
            .describe('Close other accordions when one opens'),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Container for multiple Accordion components. Set collapse=true to allow only one accordion open at a time.',
}

export const DialogDefinition = {
    props: z.object({
        title: z.string().nullish(),
        modifiers,
    }),
    slots: ['default', 'header', 'footer'],
    description:
        'Modal dialog overlay. Use for confirmations, forms, or detailed views that require user attention.',
}

export const TabDefinition = {
    props: z.object({
        items: z.array(
            z.object({
                label: z.string(),
                value: z.string(),
            }),
        ),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Tabbed interface for switching between content panels. Each item has a label (tab title) and value (identifier).',
}

// ---------------------------------------------------------------------------
// Data Display components
// ---------------------------------------------------------------------------

export const AlertDefinition = {
    props: z.object({
        title: z.string().nullish(),
        content: z.string().nullish(),
        modifiers: z
            .union([
                z.enum(['success', 'info', 'warning', 'danger', 'brand', 'accent']),
                z.array(
                    z.enum(['success', 'info', 'warning', 'danger', 'brand', 'accent']),
                ),
            ])
            .nullish(),
        dismissable: z.boolean().nullish(),
        role: z.enum(['alert', 'alertdialog']).nullish(),
    }),
    slots: ['default', 'header', 'footer'],
    description:
        'Alert notification with variant modifiers: success, info, warning, danger, brand, accent. Can be dismissable.',
}

export const AlertGroupDefinition = {
    props: z.object({
        stack: z.boolean().nullish().describe('Stack alerts vertically'),
        position: z
            .enum(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'])
            .nullish(),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Container for multiple Alert components. Supports fixed positioning and stacked layout.',
}

export const BadgeDefinition = {
    props: z.object({
        value: z.union([z.string(), z.number()]).nullish(),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Small status indicator or counter badge. Can wrap other content via default slot or display a standalone value.',
}

export const AvatarDefinition = {
    props: z.object({
        imgSrc: z.string().nullish(),
        modifiers,
    }),
    slots: ['default'],
    description:
        'User avatar component displaying a profile image. Falls back to default slot content when no image is provided.',
}

export const AvatarGroupDefinition = {
    props: z.object({
        toShow: z.number().nullish().describe('Max number of avatars to display (default: 3)'),
        totalItems: z
            .number()
            .nullish()
            .describe('Override total count shown in the overflow badge'),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Group of Avatar components with automatic overflow handling. Shows a "+N" badge when avatars exceed toShow.',
}

export const ProgressDefinition = {
    props: z.object({
        label: z.string(),
        value: z.number(),
        max: z.number().nullish(),
        modifiers,
    }),
    description:
        'Progress bar indicating task completion. value is current progress, max defaults to 100.',
}

export const IconDefinition = {
    props: z.object({
        name: z.string().describe('Iconify icon name, e.g. "mdi:home" or "heroicons:star"'),
        color: z.string().nullish(),
        size: z.number().nullish(),
    }),
    description:
        'Icon using the Iconify icon system. Use the format "collection:icon-name" for the name prop.',
}

export const TooltipDefinition = {
    props: z.object({
        value: z.string().describe('Tooltip text content'),
        position: z.enum(['top', 'bottom', 'left', 'right']).nullish(),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Floating tooltip. Wraps any content via default slot and shows the tooltip on hover.',
}

// ---------------------------------------------------------------------------
// Action components
// ---------------------------------------------------------------------------

export const ButtonDefinition = {
    props: z.object({
        label: z.string().nullish(),
        modifiers,
        disabled: z.boolean().nullish(),
        loading: z.boolean().nullish(),
        icon: z.string().nullish().describe('Iconify icon name'),
        iconPosition,
        type: z.enum(['button', 'submit', 'reset']).nullish(),
        href: z.string().nullish(),
    }),
    slots: ['default'],
    description:
        'Action button. Supports text label, icon, loading state, and link mode (href). Use type=submit inside forms.',
}

export const ButtonGroupDefinition = {
    props: z.object({
        toggle: z
            .boolean()
            .nullish()
            .describe('Enable toggle mode for child buttons'),
        multiple: z
            .boolean()
            .nullish()
            .describe('Allow multiple buttons selected at once'),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Container for Button components providing coordinated toggle selection behavior.',
}

// ---------------------------------------------------------------------------
// Navigation components
// ---------------------------------------------------------------------------

export const BreadcrumbDefinition = {
    props: z.object({
        routes: z.array(navItem),
        modifiers,
    }),
    description:
        'Breadcrumb navigation trail. Each route entry has a label and optional to (router-link) or href.',
}

export const NavDefinition = {
    props: z.object({
        items: z
            .array(
                navItem.extend({
                    items: z.array(navItem).nullish(),
                }),
            )
            .nullish(),
        modifiers,
    }),
    slots: ['default'],
    description:
        'Navigation menu component. Pass items as a tree structure with optional nested items.',
}

// ---------------------------------------------------------------------------
// Form components
// ---------------------------------------------------------------------------

export const InputTextDefinition = {
    props: z.object({
        ...formFieldProps,
        type: z
            .enum(['text', 'email', 'password', 'tel', 'url', 'search', 'date', 'time', 'number'])
            .nullish(),
        placeholder: z.string().nullish(),
        readonly: z.boolean().nullish(),
        icon: z.string().nullish().describe('Iconify icon name'),
        iconPosition,
        floating: z.boolean().nullish().describe('Floating label animation'),
    }),
    description:
        'Text input field. Supports types: text, email, password, tel, url, search, date, time, number. Use $bindState for two-way binding.',
}

export const TextareaDefinition = {
    props: z.object({
        ...formFieldProps,
        placeholder: z.string().nullish(),
        rows: z.number().nullish(),
        readonly: z.boolean().nullish(),
        floating: z.boolean().nullish().describe('Floating label animation'),
    }),
    description:
        'Multi-line text input. Use $bindState for two-way binding.',
}

export const SelectDefinition = {
    props: z.object({
        ...formFieldProps,
        options: z.array(labelValueOption),
        multiple: z.boolean().nullish(),
        placeholder: z.string().nullish(),
        floating: z.boolean().nullish().describe('Floating label animation'),
    }),
    description:
        'Native select dropdown. Pass options as an array of {label, value} objects. Use $bindState for two-way binding.',
}

export const CheckboxDefinition = {
    props: z.object({
        name: z.string().nullish(),
        label: z.string().nullish(),
        value: z.union([z.string(), z.number(), z.boolean()]).nullish(),
        disabled: z.boolean().nullish(),
        switch: z
            .boolean()
            .nullish()
            .describe('Render as a toggle switch instead of checkbox'),
        modifiers,
    }),
    description:
        'Single checkbox or toggle switch. Use $bindState for two-way binding.',
}

export const CheckboxGroupDefinition = {
    props: z.object({
        ...formFieldProps,
        options: z.array(labelValueOption),
        vertical: z.boolean().nullish(),
    }),
    slots: ['default'],
    description:
        'Group of checkbox inputs sharing a model. Pass options as {label, value} array. Use $bindState for two-way binding.',
}

export const RadioDefinition = {
    props: z.object({
        name: z.string(),
        label: z.string().nullish(),
        value: z.union([z.string(), z.number(), z.boolean()]).nullish(),
        disabled: z.boolean().nullish(),
        modifiers,
    }),
    description:
        'Single radio button. Use inside a RadioGroup or share name prop to group manually.',
}

export const RadioGroupDefinition = {
    props: z.object({
        ...formFieldProps,
        options: z.array(labelValueOption),
        vertical: z.boolean().nullish(),
    }),
    slots: ['default'],
    description:
        'Group of radio buttons sharing a model. Pass options as {label, value} array. Use $bindState for two-way binding.',
}

export const ComboboxDefinition = {
    props: z.object({
        ...formFieldProps,
        options: z.array(labelValueOption),
        placeholder: z.string().nullish(),
        searchable: z.boolean().nullish(),
        multiple: z.boolean().nullish(),
    }),
    description:
        'Combobox dropdown with optional search and multi-select. Use $bindState for two-way binding.',
}

export const InputFileDefinition = {
    props: z.object({
        ...formFieldProps,
        accept: z.string().nullish().describe('MIME types or file extensions, e.g. "image/*" or ".pdf"'),
        multiple: z.boolean().nullish(),
        max: z.number().nullish().describe('Maximum number of files'),
    }),
    description:
        'File upload input with optional drag-and-drop area. Use accept to restrict file types.',
}

// ---------------------------------------------------------------------------
// Aggregated export
// ---------------------------------------------------------------------------

/**
 * All Volver component definitions for building custom json-render catalogs.
 * Import individual definitions or spread into defineCatalog.
 */
export const volverComponentDefinitions = {
    // Layout
    Card: CardDefinition,
    Accordion: AccordionDefinition,
    AccordionGroup: AccordionGroupDefinition,
    Dialog: DialogDefinition,
    Tab: TabDefinition,
    // Data Display
    Alert: AlertDefinition,
    AlertGroup: AlertGroupDefinition,
    Badge: BadgeDefinition,
    Avatar: AvatarDefinition,
    AvatarGroup: AvatarGroupDefinition,
    Progress: ProgressDefinition,
    Icon: IconDefinition,
    Tooltip: TooltipDefinition,
    // Actions
    Button: ButtonDefinition,
    ButtonGroup: ButtonGroupDefinition,
    // Navigation
    Breadcrumb: BreadcrumbDefinition,
    Nav: NavDefinition,
    // Forms
    InputText: InputTextDefinition,
    Textarea: TextareaDefinition,
    Select: SelectDefinition,
    Checkbox: CheckboxDefinition,
    CheckboxGroup: CheckboxGroupDefinition,
    Radio: RadioDefinition,
    RadioGroup: RadioGroupDefinition,
    Combobox: ComboboxDefinition,
    InputFile: InputFileDefinition,
} as const
