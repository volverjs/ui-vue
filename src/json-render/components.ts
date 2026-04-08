import type { BaseComponentProps } from '@json-render/vue'
import { useBoundProp } from '@json-render/vue'
import { h } from 'vue'
import VvAccordion from '../components/VvAccordion/VvAccordion.vue'
import VvAccordionGroup from '../components/VvAccordionGroup/VvAccordionGroup.vue'
import VvAlert from '../components/VvAlert/VvAlert.vue'
import VvAlertGroup from '../components/VvAlertGroup/VvAlertGroup.vue'
import VvAvatar from '../components/VvAvatar/VvAvatar.vue'
import VvAvatarGroup from '../components/VvAvatarGroup/VvAvatarGroup.vue'
import VvBadge from '../components/VvBadge/VvBadge.vue'
import VvBreadcrumb from '../components/VvBreadcrumb/VvBreadcrumb.vue'
import VvButton from '../components/VvButton/VvButton.vue'
import VvButtonGroup from '../components/VvButtonGroup/VvButtonGroup.vue'
import VvCard from '../components/VvCard/VvCard.vue'
import VvCheckbox from '../components/VvCheckbox/VvCheckbox.vue'
import VvCheckboxGroup from '../components/VvCheckboxGroup/VvCheckboxGroup.vue'
import VvCombobox from '../components/VvCombobox/VvCombobox.vue'
import VvDialog from '../components/VvDialog/VvDialog.vue'
import VvIcon from '../components/VvIcon/VvIcon.vue'
import VvInputFile from '../components/VvInputFile/VvInputFile.vue'
import VvInputText from '../components/VvInputText/VvInputText.vue'
import VvNav from '../components/VvNav/VvNav.vue'
import VvProgress from '../components/VvProgress/VvProgress.vue'
import VvRadio from '../components/VvRadio/VvRadio.vue'
import VvRadioGroup from '../components/VvRadioGroup/VvRadioGroup.vue'
import VvSelect from '../components/VvSelect/VvSelect.vue'
import VvTab from '../components/VvTab/VvTab.vue'
import VvTextarea from '../components/VvTextarea/VvTextarea.vue'
import VvTooltip from '../components/VvTooltip/VvTooltip.vue'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Pick keys from json-render props, converting nulls to undefined
 * so Vue components receive clean prop values.
 */
function pick(props: Record<string, unknown>, keys: string[]): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const key of keys) {
        result[key] = props[key] ?? undefined
    }
    return result
}

/** Render a Volver component with picked props and an optional default slot. */
function render(
    component: object,
    props: Record<string, unknown>,
    keys: string[],
    extra?: Record<string, unknown>,
    children?: unknown,
) {
    const slots
        = children == null
            ? undefined
            : typeof children === 'object' && !Array.isArray(children)
                ? (children as Record<string, () => unknown>)
                : { default: () => children }
    return h(component as any, { ...pick(props, keys), ...extra }, slots)
}

// ---------------------------------------------------------------------------
// Layout & Container
// ---------------------------------------------------------------------------

export function CardComponent({ props, children }: BaseComponentProps) {
    return render(VvCard, props, ['title', 'modifiers'], undefined, children)
}

export function AccordionComponent({ props, children }: BaseComponentProps) {
    return render(VvAccordion, props, ['title', 'content', 'modifiers'], undefined, children)
}

export function AccordionGroupComponent({ props, children }: BaseComponentProps) {
    return render(VvAccordionGroup, props, ['collapse', 'modifiers'], undefined, children)
}

export function DialogComponent({ props, children, bindings }: BaseComponentProps) {
    return useRenderBound<boolean>(VvDialog, props, ['title', 'modifiers'], bindings, undefined, children)
}

export function TabComponent({ props }: BaseComponentProps) {
    return render(VvTab, props, ['items', 'modifiers'])
}

// ---------------------------------------------------------------------------
// Data Display
// ---------------------------------------------------------------------------

export function AlertComponent({ props, children, emit }: BaseComponentProps) {
    return render(VvAlert, props, ['title', 'content', 'modifiers', 'dismissable', 'role'], { onClose: () => emit('close') }, children)
}

export function AlertGroupComponent({ props, children }: BaseComponentProps) {
    return render(VvAlertGroup, props, ['stack', 'position', 'modifiers'], { name: 'json-render-alerts' }, children)
}

export function BadgeComponent({ props, children }: BaseComponentProps) {
    return render(VvBadge, props, ['value', 'modifiers'], undefined, children)
}

export function AvatarComponent({ props, children }: BaseComponentProps) {
    return render(VvAvatar, props, ['imgSrc', 'modifiers'], undefined, children)
}

export function AvatarGroupComponent({ props, children }: BaseComponentProps) {
    return render(VvAvatarGroup, props, ['toShow', 'totalItems', 'modifiers'], { items: [] }, children)
}

export function ProgressComponent({ props }: BaseComponentProps) {
    return render(VvProgress, props, ['label', 'value', 'max', 'modifiers'])
}

export function IconComponent({ props }: BaseComponentProps) {
    return h(VvIcon as any, {
        name: props.name,
        color: props.color ?? undefined,
        width: props.size ?? undefined,
        height: props.size ?? undefined,
    })
}

export function TooltipComponent({ props, children }: BaseComponentProps) {
    return render(VvTooltip, props, ['value', 'position', 'modifiers'], undefined, children)
}

// ---------------------------------------------------------------------------
// Action components
// ---------------------------------------------------------------------------

export function ButtonComponent({ props, children, emit }: BaseComponentProps) {
    return render(
        VvButton,
        props,
        ['label', 'modifiers', 'disabled', 'loading', 'icon', 'iconPosition', 'type', 'href'],
        { type: props.type ?? 'button', onClick: () => emit('press') },
        children,
    )
}

export function ButtonGroupComponent({ props, children }: BaseComponentProps) {
    return render(VvButtonGroup, props, ['toggle', 'multiple', 'modifiers'], undefined, children)
}

// ---------------------------------------------------------------------------
// Navigation components
// ---------------------------------------------------------------------------

export function BreadcrumbComponent({ props }: BaseComponentProps) {
    return render(VvBreadcrumb, props, ['routes', 'modifiers'])
}

export function NavComponent({ props, children }: BaseComponentProps) {
    return render(VvNav, props, ['items', 'modifiers'], undefined, children)
}

// ---------------------------------------------------------------------------
// Form components (with $bindState two-way binding support)
// ---------------------------------------------------------------------------

/** Render a form component with two-way binding via useBoundProp. */
function useRenderBound<T>(
    component: object,
    props: Record<string, unknown>,
    keys: string[],
    bindings: Record<string, string> | undefined,
    extra?: Record<string, unknown>,
    children?: unknown,
) {
    const [value, setValue] = useBoundProp<T>(undefined, bindings?.value)
    return render(component, props, keys, { ...extra, 'modelValue': value, 'onUpdate:modelValue': setValue }, children)
}

export function InputTextComponent({ props, bindings }: BaseComponentProps) {
    return useRenderBound<string | number>(
        VvInputText,
        props,
        ['name', 'label', 'type', 'placeholder', 'required', 'disabled', 'readonly', 'icon', 'iconPosition', 'floating', 'modifiers'],
        bindings,
    )
}

export function TextareaComponent({ props, bindings }: BaseComponentProps) {
    return useRenderBound<string>(
        VvTextarea,
        props,
        ['name', 'label', 'placeholder', 'rows', 'required', 'disabled', 'readonly', 'floating', 'modifiers'],
        bindings,
    )
}

export function SelectComponent({ props, bindings }: BaseComponentProps) {
    return useRenderBound<unknown>(
        VvSelect,
        props,
        ['name', 'label', 'options', 'multiple', 'placeholder', 'required', 'disabled', 'floating', 'modifiers'],
        bindings,
    )
}

export function CheckboxComponent({ props, bindings }: BaseComponentProps) {
    return useRenderBound<boolean>(
        VvCheckbox,
        props,
        ['name', 'label', 'value', 'disabled', 'switch', 'modifiers'],
        bindings,
    )
}

export function CheckboxGroupComponent({ props, children, bindings }: BaseComponentProps) {
    return useRenderBound<unknown[]>(
        VvCheckboxGroup,
        props,
        ['name', 'label', 'options', 'vertical', 'required', 'disabled', 'modifiers'],
        bindings,
        undefined,
        children,
    )
}

export function RadioComponent({ props, bindings }: BaseComponentProps) {
    return useRenderBound<string | number | boolean>(
        VvRadio,
        props,
        ['name', 'label', 'value', 'disabled', 'modifiers'],
        bindings,
    )
}

export function RadioGroupComponent({ props, children, bindings }: BaseComponentProps) {
    return useRenderBound<string | number | boolean>(
        VvRadioGroup,
        props,
        ['name', 'label', 'options', 'vertical', 'required', 'disabled', 'modifiers'],
        bindings,
        undefined,
        children,
    )
}

export function ComboboxComponent({ props, bindings }: BaseComponentProps) {
    return useRenderBound<unknown>(
        VvCombobox,
        props,
        ['name', 'label', 'options', 'placeholder', 'searchable', 'multiple', 'modifiers'],
        bindings,
    )
}

export function InputFileComponent({ props, bindings }: BaseComponentProps) {
    return useRenderBound<File[]>(
        VvInputFile,
        props,
        ['name', 'label', 'accept', 'multiple', 'max', 'modifiers'],
        bindings,
    )
}

// ---------------------------------------------------------------------------
// Aggregated export
// ---------------------------------------------------------------------------

/**
 * All Volver Vue component implementations for building custom json-render registries.
 * Import individual entries or spread into defineRegistry.
 */
export const volverComponents = {
    // Layout
    Card: CardComponent,
    Accordion: AccordionComponent,
    AccordionGroup: AccordionGroupComponent,
    Dialog: DialogComponent,
    Tab: TabComponent,
    // Data Display
    Alert: AlertComponent,
    AlertGroup: AlertGroupComponent,
    Badge: BadgeComponent,
    Avatar: AvatarComponent,
    AvatarGroup: AvatarGroupComponent,
    Progress: ProgressComponent,
    Icon: IconComponent,
    Tooltip: TooltipComponent,
    // Actions
    Button: ButtonComponent,
    ButtonGroup: ButtonGroupComponent,
    // Navigation
    Breadcrumb: BreadcrumbComponent,
    Nav: NavComponent,
    // Forms
    InputText: InputTextComponent,
    Textarea: TextareaComponent,
    Select: SelectComponent,
    Checkbox: CheckboxComponent,
    CheckboxGroup: CheckboxGroupComponent,
    Radio: RadioComponent,
    RadioGroup: RadioGroupComponent,
    Combobox: ComboboxComponent,
    InputFile: InputFileComponent,
} as const
