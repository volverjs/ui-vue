import type { MaybeElement, MaybeElementRef } from '@vueuse/core'

export function useComponentFocus(
	inputTemplateRef: MaybeElementRef<MaybeElement>,
	emit: (event: 'focus' | 'blur', value: unknown) => void,
) {
	const { focused } = useFocus(inputTemplateRef)

	watch(focused, (newValue) => {
		emit(newValue ? 'focus' : 'blur', unref(inputTemplateRef))
	})

	return {
		focused,
	}
}
