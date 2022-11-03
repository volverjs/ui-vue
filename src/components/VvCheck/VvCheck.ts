import { ValidProps, ErrorProps } from '../common/Props'

export const VvCheckProps = {
	...ValidProps,
	...ErrorProps,
	/**
	 * Valore della check
	 */
	value: null,
	/**
	 * VModel
	 * @description
	 * Se Binary = true, modelValue puo essere Object,Boolean,Number
	 * Altrimenti modelValue sarà un Array
	 */
	modelValue: null,
	/**
	 * True - ritorna un valore del checkbox binario (es True/False) invece di un valori multipli
	 */
	binary: Boolean,
	/**
	 * Se binary=true, valore associato allo stato checked (ritornato al posto di TRUE)
	 */
	trueValue: { type: null, default: true },
	/**
	 * Se binary=true, valore associato allo stato unchecked (ritornato al posto di FALSE)
	 */
	falseValue: { type: null, default: false },
	/**
	 * True - visualizza il VvCheck come un pulsante Switch/Toggle
	 */
	switch: Boolean,
	label: String,
	disabled: Boolean,
	readonly: Boolean
}

export const VvCheckEvents = [
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
]
