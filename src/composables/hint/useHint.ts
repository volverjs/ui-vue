import { computed, toRefs } from 'vue'

export function useHint(props: any, context: any) {
	const { slots } = context

	const { hintLabel } = toRefs(props)

	const hasHintLabel = computed(() => {
		return hintLabel.value || slots.hint
	})

	return {
		hasHintLabel
	}
}
