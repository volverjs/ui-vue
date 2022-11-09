import { isString } from '@vueuse/core'
import { computed, unref, type Ref } from 'vue'

interface useTextOptions {
	mode: string //'limit' | 'countdown'
	upperLimit: number
}

/**
 *
 */
export function useTextLimit(inputText: Ref<string>, options: useTextOptions) {
	const textLength = computed(() => {
		const _text = unref(inputText)
		return isString(_text) ? _text.length : 0
	})

	const textLimitLength = computed(() => {
		const _text = unref(inputText) || ''

		if (!isString(_text)) return 0

		if (options.mode === 'limit') return _text.length
		else return unref(options.upperLimit) - _text.length
	})

	const formattedTextLimitLength = computed(() => {
		if (
			options.mode === 'limit' &&
			options.upperLimit &&
			options.upperLimit > 0
		)
			return `${textLimitLength.value}/${unref(options.upperLimit)}`
		else return textLimitLength.value
	})

	return {
		textLength,
		textLimitLength,
		formattedTextLimitLength
	}
}
