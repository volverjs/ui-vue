import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { argTypes, defaultArgs } from './InputText.settings'
import { Default } from './InputText.stories'
import { beforeOverflowTest } from './InputText.test'

const meta: Meta<typeof VvInputText> = {
    title: 'Components/InputText/Slots',
    component: VvInputText,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const Before: Story = {
    ...Default,
    args: {
        ...Default.args,
        before: '<div class="vv-badge vv-badge--sm uppercase">Before</div>',
    },
}

/**
 * Chips in the `#before` slot, like a field that collects e-mail addresses
 * (Enter adds the typed one). Up to `@volverjs/style` 0.1.33 `__inner` had
 * `flex: 1`, a basis of 0, while `__input-before` started from the width of
 * all its chips and kept the whole row once they filled it: `__inner` got 0px
 * and the input, clipped by the wrapper, could no longer be clicked. Since
 * 0.1.34 the row wraps and the input keeps at least `min(10rem, 50%)` of it.
 */
export const BeforeOverflow: Story = {
    args: {
        ...defaultArgs,
        label: 'Cc',
        placeholder: 'Add an address',
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            const addresses = ref([
                'first.address@example.com',
                'second.address@example.com',
            ])
            const inputValue = ref<string>()
            const containerEl = ref<HTMLElement>()
            const innerWidth = ref<number>()
            let observer: ResizeObserver | undefined
            onMounted(() => {
                const inner = containerEl.value?.querySelector(
                    '.vv-input-text__inner',
                )
                if (!inner) {
                    return
                }
                observer = new ResizeObserver(() => {
                    innerWidth.value = Math.round(
                        inner.getBoundingClientRect().width,
                    )
                })
                observer.observe(inner)
            })
            onBeforeUnmount(() => observer?.disconnect())
            function onKeydown(event: KeyboardEvent) {
                if (event.key !== 'Enter' || !inputValue.value) {
                    return
                }
                addresses.value.push(inputValue.value)
                inputValue.value = undefined
            }
            return { args, addresses, inputValue, containerEl, innerWidth, onKeydown }
        },
        template: /* html */ `
			<div ref="containerEl" style="max-width: 28rem">
				<vv-input-text v-bind="args" v-model="inputValue" data-testId="element" @keydown="onKeydown">
					<template #before>
						<div class="flex flex-wrap gap-4">
							<span v-for="address in addresses" :key="address" class="vv-badge vv-badge--sm">{{ address }}</span>
						</div>
					</template>
				</vv-input-text>
			</div>
			<div>Width of <code>__inner</code>: <span data-testId="inner-width">{{ innerWidth }}</span>px</div>
		`,
    }),
    play: beforeOverflowTest,
}

export const After: Story = {
    ...Default,
    args: {
        ...Default.args,
        after: '<div class="vv-badge vv-badge--sm uppercase">After</div>',
    },
}

export const Hint: Story = {
    ...Default,
    args: {
        ...Default.args,
        hint: 'Hint <em class="italic">slot!</em>',
    },
}
