<script lang="ts">
	export default {
		name: 'VvInputFile',
	}
</script>

<script setup lang="ts">
	import { useVModel } from '@vueuse/core'
	import type { UploadedFile } from '../../types'
	import { computed, onBeforeUnmount, ref } from 'vue'
	import VvButton from '../VvButton/VvButton.vue'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import HintSlotFactory from '../common/HintSlot'
	import { VvInputFileProps, type VvInputFileEvents } from '.'

	// props, emit, slots and attrs
	const props = defineProps(VvInputFileProps)
	const emit = defineEmits<VvInputFileEvents>()
	const slots = useSlots()

	// props merged with volver defaults (now only for labels)
	const propsDefaults = useDefaults<typeof VvInputFileProps>(
		'VvInputFile',
		VvInputFileProps,
		props,
	)

	const { modifiers, id, readonly } = toRefs(props)

	const hasId = useUniqueId(id)
	const hasHintId = computed(() => `${hasId.value}-hint`)

	// styles
	const bemCssClasses = useModifiers(
		'vv-input-file',
		modifiers,
		computed(() => ({
			dragging: isDragging.value,
			loading: props.loading,
			valid: props.valid === true,
			invalid: props.invalid === true,
			'icon-before': !!props.iconLeft,
			'icon-after': !!props.iconRight,
		})),
	)

	const {
		HintSlot,
		hasHintLabelOrSlot,
		hasInvalidLabelOrSlot,
		hintSlotScope,
	} = HintSlotFactory(propsDefaults, slots)

	const localModelValue = useVModel(props, 'modelValue', emit)
	const files = computed(() => {
		if (
			!localModelValue.value ||
			(!Array.isArray(localModelValue.value) &&
				!(localModelValue.value as File)?.name)
		) {
			return []
		}
		return Array.isArray(localModelValue.value)
			? localModelValue.value
			: [localModelValue.value]
	})

	const hasMax = computed(() => {
		return typeof props.max === 'string' ? parseInt(props.max) : props.max
	})

	const hasDropArea = computed(() => {
		return modifiers?.value?.includes('drop-area')
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

	const isDragging = ref(false)

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

	const addFiles = (uploadedFiles: FileList) => {
		if (!props.multiple) {
			if (Array.isArray(localModelValue.value)) {
				localModelValue.value = [...uploadedFiles]
				return
			}
			localModelValue.value = uploadedFiles[0]
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
		for (const file of uploadedFiles) {
			if (hasMax.value && toReturn.length >= hasMax.value) {
				break
			}
			toReturn.push(file)
		}

		localModelValue.value = toReturn
	}

	const onClick = () => {
		if (!inputEl.value) {
			return
		}
		if (!readonly.value) {
			inputEl.value.click()
		}
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

	const currentFileIndex = ref(0)
	const previewSrc = computed(() => {
		if (files.value.length === 0) {
			return
		}
		if (files.value[currentFileIndex.value] instanceof File) {
			return URL.createObjectURL(
				files.value[currentFileIndex.value] as File,
			)
		}
		return (files.value[currentFileIndex.value] as UploadedFile).url
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

	const onClickDownloadFile = (file: File | UploadedFile) => {
		const link = document.createElement('a')
		if (file instanceof File) {
			link.href = URL.createObjectURL(file)
		} else if (file.url) {
			link.href = file.url
		}
		link.setAttribute('download', file.name)
		document.body.appendChild(link)
		link.click()
	}
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId">
			{{ label }}
		</label>
		<div
			v-if="hasDropArea"
			class="vv-input-file__drop-area"
			@dragenter.prevent.stop="onDragenter"
			@dragleave.prevent.stop="onDragleave"
			@drop.prevent.stop="onDrop"
			@dragover.prevent.stop
			@click.stop="onClick"
		>
			<slot name="drop-area">
				<VvButton
					v-if="!readonly"
					modifiers="action"
					aria-label="upload"
					:label="!previewSrc ? labelButton : undefined"
					:class="{
						'absolute top-8 right-8': previewSrc,
					}"
					:icon="!previewSrc ? 'image' : isMultiple ? 'add' : 'edit'"
					class="z-1"
					@click.stop="onClick"
				/>
				<picture class="vv-input-file__preview">
					<img
						v-if="previewSrc"
						:src="previewSrc"
						:alt="files[currentFileIndex].name"
					/>
				</picture>
			</slot>
		</div>
		<div class="vv-input-file__wrapper">
			<VvIcon v-if="iconLeft" :name="iconLeft" />
			<input
				:id="hasId"
				ref="inputEl"
				:readonly="readonly"
				:placeholder="placeholder"
				:aria-describedby="hasHintLabelOrSlot ? hasHintId : undefined"
				:aria-invalid="invalid"
				:aria-errormessage="
					hasInvalidLabelOrSlot ? hasHintId : undefined
				"
				:multiple="isMultiple"
				:accept="accept"
				type="file"
				:name="name"
				@change="onChange"
			/>
			<VvIcon v-if="iconRight" :name="iconRight" />
		</div>
		<ul class="vv-input-file__list">
			<li
				v-for="(file, index) in files"
				:key="index"
				class="vv-input-file__item"
				@click.stop="currentFileIndex = index"
			>
				<button
					type="button"
					class="vv-input-file__item-icon cursor-pointer"
					title="Download"
					aria-label="download-file"
					@click.stop="onClickDownloadFile(file)"
				>
					<VvIcon name="download" />
				</button>
				<div class="vv-input-file__item-name cursor-pointer">
					{{ file.name }}
				</div>
				<small class="vv-input-file__item-info">
					{{ sizeInKiB(file.size) }} KB
				</small>
				<button
					v-if="!readonly"
					type="button"
					class="vv-input-file__item-remove"
					title="Remove"
					aria-label="remove-file"
					@click.stop="onClickRemoveFile(index)"
				/>
			</li>
		</ul>
		<HintSlot :id="hasHintId" class="vv-input-file__hint">
			<template v-if="$slots.hint" #hint>
				<slot name="hint" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.loading" #loading>
				<slot name="loading" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.valid" #valid>
				<slot name="valid" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.invalid" #invalid>
				<slot name="invalid" v-bind="hintSlotScope" />
			</template>
		</HintSlot>
	</div>
</template>
