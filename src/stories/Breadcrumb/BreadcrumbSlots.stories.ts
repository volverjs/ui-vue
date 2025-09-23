import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvBreadcrumb from '@/components/VvBreadcrumb/VvBreadcrumb.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { argTypes, defaultArgs } from './Breadcrumb.settings'
import { defaultTest } from './Breadcrumb.test'

const meta: Meta<typeof VvBreadcrumb> = {
    title: 'Components/Breadcrumb/Slots',
    component: VvBreadcrumb,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvBreadcrumb>

export const Label: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvBreadcrumb, VvIcon },
        setup() {
            return { args }
        },
        template: /* html */ `
					<VvBreadcrumb v-bind="args">
						<template #label="{index, label}">
							<VvIcon v-if="index === 0" name="home" :aria-label="label"  />
							<template v-else>{{ label }}</template>
						</template>
					</VvBreadcrumb>
            	`,
    }),
    play: data => defaultTest(data, true),
}
