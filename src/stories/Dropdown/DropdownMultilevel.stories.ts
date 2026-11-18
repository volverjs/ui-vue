import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import VvDropdownItem from '@/components/VvDropdown/VvDropdownItem.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { argTypes, defaultArgs } from './Dropdown.settings'
import {
    defaultTest,
    nestedClickTest,
    nestedInItemTest,
    nestedKeyboardTest,
    nestedTabOutTest,
} from './Dropdown.test'

const meta: Meta<typeof VvDropdown> = {
    title: 'Components/Dropdown/Multilevel',
    component: VvDropdown,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvDropdown>

const multilevelTemplate = /* html */ `
    <vv-dropdown v-model="expanded" v-bind="args" data-testId="wrapper">
        <vv-button ref="toggle" class="absolute top-1/2 left-1/2 -translate-1/2" modifiers="full-bleed" data-testId="trigger">
            Toggle dropdown
        </vv-button>
        <template #items>
            <vv-dropdown-action>
                <vv-icon name="edit" /> Update
            </vv-dropdown-action>
            <vv-dropdown-action>
                <vv-icon name="trash" /> Delete
            </vv-dropdown-action>
            <vv-dropdown placement="right-start" offset="5" arrow>
                <vv-dropdown-action>
                    <vv-icon name="more-vertical" /> More
                </vv-dropdown-action>
                <template #items>
                    <vv-dropdown-action>
                        <vv-icon name="add" /> Create
                    </vv-dropdown-action>
                    <vv-dropdown-action>
                        <vv-icon name="eye-on" /> Publish
                    </vv-dropdown-action>
                </template>
            </vv-dropdown>
        </template>
    </vv-dropdown>
`

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvIcon, VvButton },
        setup() {
            const expanded = ref(false)
            return { expanded, args }
        },
        template: multilevelTemplate,
    }),
    play: defaultTest,
}

/**
 * Enter on More opens the nested dropdown, the arrows there move one item,
 * and Escape closes it alone, then the outer one.
 */
export const NestedKeyboard: Story = {
    ...Default,
    play: nestedKeyboardTest,
}

/**
 * A click on More opens the nested dropdown and leaves the outer one open, a
 * click on Create closes both and gives the focus back to the trigger.
 */
export const NestedClick: Story = {
    ...Default,
    play: nestedClickTest,
}

/**
 * `Tab` through the items of the nested dropdown leaves both open, and
 * `Shift+Tab` back to More closes the nested one alone. `Tab` past Publish,
 * the last item of both, closes both and leaves the focus on the button
 * after them.
 */
export const NestedTabOut: Story = {
    ...Default,
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvIcon, VvButton },
        setup() {
            const expanded = ref(false)
            return { expanded, args }
        },
        template: /* html */ `
            <div>
                ${multilevelTemplate}
                <vv-button data-testId="next" label="Next" />
            </div>
        `,
    }),
    play: nestedTabOutTest,
}

/**
 * A dropdown with `keepOpen` inside an item of the menu, with a button in its
 * `after` slot: a click on that button leaves both open.
 */
export const NestedInItem: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: {
            VvDropdown,
            VvDropdownAction,
            VvDropdownItem,
            VvButton,
        },
        setup() {
            return { args }
        },
        template: /* html */ `
            <vv-dropdown v-bind="args">
                <vv-button class="absolute top-1/2 left-1/2 -translate-1/2" data-testId="trigger">
                    Toggle dropdown
                </vv-button>
                <template #items>
                    <vv-dropdown-action>Update</vv-dropdown-action>
                    <vv-dropdown-item>
                        <vv-dropdown placement="right-start" offset="5" keep-open>
                            <vv-button data-testId="nested-trigger" label="Filters" />
                            <template #items>
                                <vv-dropdown-action>Recent first</vv-dropdown-action>
                            </template>
                            <template #after>
                                <vv-button data-testId="done" label="Done" />
                            </template>
                        </vv-dropdown>
                    </vv-dropdown-item>
                </template>
            </vv-dropdown>
        `,
    }),
    play: nestedInItemTest,
}
