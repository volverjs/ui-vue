<script setup lang="ts">
	import { useVModel } from '@vueuse/core'
	import type { UploadedFile } from '../../types'
	import { computed, onBeforeUnmount, ref } from 'vue'
	import VvButton from '../VvButton/VvButton.vue'
	import VvIcon from '../VvIcon/VvIcon.vue'

	const props = withDefaults(
		defineProps<{
			modelValue?: File | (File | UploadedFile)[] | UploadedFile
			modifiers?: string | string[]
			label?: string
			labelButton?: string
			id?: string
			name: string
			accept?: string
			loading?: boolean
			valid?: boolean
			invalid?: boolean
			hint?: string | number
			placeholder?: string
			multiple?: boolean
			max?: number | string
		}>(),
		{
			modelValue: undefined,
			id: Math.random().toString(36),
			modifiers: () => [],
			label: '',
			labelButton: 'Image',
			accept: '',
			hint: '',
			placeholder: '',
			multiple: false,
			max: undefined,
		},
	)
	const emit = defineEmits<{
		'update:modelValue': [File | undefined]
	}>()
	const localModelValue = useVModel(props, 'modelValue', emit)
	const files = computed(() => {
		if (!localModelValue.value) {
			return []
		}
		return Array.isArray(localModelValue.value)
			? localModelValue.value
			: [localModelValue.value]
	})

	const hasMax = computed(() => {
		return typeof props.max === 'string' ? parseInt(props.max) : props.max
	})

	const isMultiple = computed(() => {
		if (!props.multiple) {
			return false
		}
		if (!hasMax.value) {
			return true
		}
		return hasMax.value - files.value.length > 1
	})

	const normalizedModifiers = computed(() => {
		let toReturn = props.modifiers
		if (typeof toReturn === 'string') {
			toReturn = toReturn.split(' ')
		}
		return toReturn.map((modifier) => `vv-input-file--${modifier}`)
	})
	const isDragging = ref(false)
	const attributes = computed(() => {
		return {
			class: [
				'vv-input-file',
				...normalizedModifiers.value,
				{
					'vv-input-file--dragging': isDragging.value,
					'vv-input-file--loading': props.loading,
					'vv-input-file--valid': props.valid === true,
					'vv-input-file--invalid': props.invalid === true,
				},
			],
		}
	})

	const inputEl = ref<HTMLInputElement>()
	const onDragenter = () => {
		isDragging.value = true
	}

	const onDragleave = () => {
		isDragging.value = false
	}

	const onDrop = (event: DragEvent) => {
		if (!event.dataTransfer?.files) {
			return
		}
		isDragging.value = false
		addFiles(event.dataTransfer?.files)
	}

	const onChange = () => {
		if (!inputEl.value?.files) {
			return
		}
		addFiles(inputEl.value.files)
		inputEl.value.value = ''
	}

	const addFiles = (files: FileList) => {
		if (!props.multiple) {
			if (Array.isArray(localModelValue.value)) {
				localModelValue.value = [...files]
				return
			}
			localModelValue.value = files[0]
			return
		}
		let toReturn: (File | UploadedFile)[] = []
		if (!Array.isArray(localModelValue.value) && localModelValue.value) {
			toReturn = [localModelValue.value]
		} else {
			toReturn =
				localModelValue.value && Array.isArray(localModelValue.value)
					? [...localModelValue.value]
					: toReturn
		}
		for (let i = 0; i < files.length; i++) {
			if (hasMax.value && toReturn.length >= hasMax.value) {
				break
			}
			toReturn.push(files[i])
		}
		localModelValue.value = toReturn
	}

	const onClick = () => {
		if (!inputEl.value) {
			return
		}
		inputEl.value.click()
	}

	const onClickRemoveFile = (index: number) => {
		if (!Array.isArray(localModelValue.value)) {
			localModelValue.value = undefined
			return
		}
		const toReturn = [...localModelValue.value]
		toReturn.splice(index, 1)
		localModelValue.value = toReturn
	}

	const previewSrc = computed(() => {
		if (files.value.length === 0) {
			return
		}
		if (files.value[0] instanceof File) {
			return URL.createObjectURL(files.value[0])
		}
		return files.value[0].url
	})

	onBeforeUnmount(() => {
		if (previewSrc.value) {
			URL.revokeObjectURL(previewSrc.value)
		}
	})

	const sizeInKiB = (size?: number) => {
		if (!size) {
			return
		}
		return Math.floor(size / 1024)
	}
</script>

<template>
	<div v-bind="attributes">
		<label v-if="label" :for="id">
			{{ label }}
		</label>
		<div
			class="vv-input-file__drop-area rounded"
			@dragenter.prevent.stop="onDragenter"
			@dragleave.prevent.stop="onDragleave"
			@drop.prevent.stop="onDrop"
			@dragover.prevent.stop
			@click.stop="onClick"
		>
			<VvButton
				modifiers="action"
				:label="!previewSrc ? labelButton : undefined"
				:class="{
					'absolute top-8 right-8': previewSrc,
				}"
				:icon="{
					name: !previewSrc ? 'image-add' : 'edit',
					prefix: 'siv',
				}"
				class="z-1"
				@click.stop="onClick"
			/>
			<picture class="vv-input-file__preview">
				<img v-if="previewSrc" :src="previewSrc" :alt="files[0].name" />
			</picture>
		</div>
		<div class="vv-input-file__wrapper">
			<input
				:id="id"
				ref="inputEl"
				:placeholder="placeholder"
				:aria-describedby="hint ? `${id}-hint` : undefined"
				:multiple="isMultiple"
				:accept="accept"
				type="file"
				:name="name"
				@change="onChange"
			/>
		</div>
		<ul class="vv-input-file__list">
			<li
				v-for="(file, index) in files"
				:key="index"
				class="vv-input-file__item"
			>
				<VvIcon
					class="vv-input-file__item-icon"
					name="akar-icons:file"
				/>
				<div class="vv-input-file__item-name">{{ file.name }}</div>
				<small class="vv-input-file__item-info">
					{{ sizeInKiB(file.size) }} KB
				</small>
				<button
					type="button"
					class="vv-input-file__item-remove"
					title="Remove"
					@click.stop="onClickRemoveFile(index)"
				/>
			</li>
		</ul>
		<small v-if="hint" :id="`${id}-hint`" class="vv-input-file__hint">
			{{ hint }}
		</small>
	</div>
</template>
