<script setup lang="ts">
import type { UploadedFile } from '../../types'
import { useVModel } from '@vueuse/core'
import { computed, onBeforeUnmount, ref } from 'vue'
import Sortable from 'vuedraggable'
import { type VvInputFileEvents, VvInputFileProps } from '.'
import HintSlotFactory from '../common/HintSlot'
import VvButton from '../VvButton/VvButton.vue'
import VvIcon from '../VvIcon/VvIcon.vue'

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
const { modifiers, id, readonly, disabled, icon, iconPosition, iconDownload }
		= toRefs(props)
const hasId = useUniqueId(id)
const hasHintId = computed(() => `${hasId.value}-hint`)

const hasProgress = computed(() => {
    if (!props.progress) {
        return false
    }
    const progress
			= typeof props.progress === 'string'
			    ? Number.parseInt(props.progress)
			    : props.progress
    return progress > 0 && progress < 100
})

const { hasIconBefore, hasIconAfter } = useComponentIcon(icon, iconPosition)
const { hasIcon: hasIconDownload } = useComponentIcon(iconDownload)

// styles
const bemCssClasses = useModifiers(
    'vv-input-file',
    modifiers,
    computed(() => ({
        'valid': props.valid === true,
        'invalid': props.invalid === true,
        'loading': props.loading && !hasProgress.value,
        'disabled': props.disabled,
        'required': props.required,
        'readonly': props.readonly,
        'dragging': isDragging.value,
        'icon-before': !!hasIconBefore.value,
        'icon-after': !!hasIconAfter.value,
        'drop-area': hasDropArea.value,
    })),
)

const {
    HintSlot,
    hasHintLabelOrSlot,
    hasInvalidLabelOrSlot,
    hintSlotScope,
} = HintSlotFactory(propsDefaults, slots)

const localModelValue = useVModel(props, 'modelValue', emit)
const files = computed({
    get: () => {
        if (
            !localModelValue.value
            || (!Array.isArray(localModelValue.value)
                && !(localModelValue.value as File)?.name)
        ) {
            return []
        }
        return Array.isArray(localModelValue.value)
            ? localModelValue.value
            : [localModelValue.value]
    },
    set: (value) => {
        if (isMultiple.value) {
            localModelValue.value = value
            return
        }
        localModelValue.value = value?.[0]
    },
})

const isDisabledOrReadonly = computed(() => props.disabled || props.readonly)

const hasMax = computed(() => {
    return typeof props.max === 'string' ? Number.parseInt(props.max) : props.max
})

const hasDropArea = computed(() => {
    return props.dropArea && !isDisabledOrReadonly.value
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
function onDragenter() {
    isDragging.value = true
}

function onDragleave() {
    isDragging.value = false
}

function onDrop(event: DragEvent) {
    if (!event.dataTransfer?.files) {
        return
    }
    isDragging.value = false
    addFiles(event.dataTransfer?.files)
}

function onChange() {
    if (!inputEl.value?.files) {
        return
    }
    addFiles(inputEl.value.files)
    inputEl.value.value = ''
}

function addFiles(uploadedFiles: FileList) {
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
    }
    else {
        toReturn
				= localModelValue.value && Array.isArray(localModelValue.value)
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
    selectedFileIndex.value = toReturn.length - 1
}

function onClickDropArea() {
    if (!inputEl.value) {
        return
    }
    if (!isDisabledOrReadonly.value) {
        inputEl.value.click()
    }
}

function onClickRemoveFile(index: number) {
    const toRemove = !Array.isArray(localModelValue.value) ? localModelValue.value : localModelValue.value[index]
    if (!toRemove) {
        return
    }
    emit('remove', toRemove)
    if (!Array.isArray(localModelValue.value)) {
        localModelValue.value = undefined
        return
    }
    if (selectedFileIndex.value === index) {
        selectedFileIndex.value = 0
    }
    const newModelValue = [...localModelValue.value]
    newModelValue.splice(index, 1)
    localModelValue.value = newModelValue
}

const selectedFileIndex = ref(0)
const PREVIEW_MIME_TYPES = ['image/jpeg', 'image/png']
const previewSrc = computed(() => {
    if (files.value.length === 0) {
        return
    }
    if (!files.value[selectedFileIndex.value]) {
        return undefined
    }
    if (files.value[selectedFileIndex.value] instanceof File) {
        const currentFile = files.value[selectedFileIndex.value] as File
        if (!PREVIEW_MIME_TYPES.includes(currentFile.type)) {
            return undefined
        }
        return URL.createObjectURL(currentFile)
    }
    const currentFile = files.value[selectedFileIndex.value] as UploadedFile
    if (currentFile.thumbnailUrl) {
        return currentFile.thumbnailUrl
    }
    if (!PREVIEW_MIME_TYPES.includes(currentFile.type)) {
        return undefined
    }
    return currentFile.url
})

watch(previewSrc, (_newValue, oldValue) => {
    if (oldValue) {
        URL.revokeObjectURL(oldValue)
    }
})

onBeforeUnmount(() => {
    if (previewSrc.value) {
        URL.revokeObjectURL(previewSrc.value)
    }
})

function formatBytes(bytes?: number, decimals?: number) {
    if (!bytes) {
        return
    }
    if (bytes === 0)
        return '0 Bytes'
    const k = 1024
    const dm = !decimals ? 2 : decimals <= 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`
}

function onClickDownloadFile(file: File | UploadedFile) {
    emit('download', file)
    const href = file instanceof File ? URL.createObjectURL(file) : file.url
    if (!href) {
        return
    }
    const link = document.createElement('a')
    link.href = href
    link.setAttribute('download', file.name)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
}

function onClickSelectFile(index: number) {
    selectedFileIndex.value = index
}

const dropdAreaActionLabel = computed(() => {
    if (files.value.length === 0 || isMultiple.value) {
        return props.labelAdd
    }
    return props.labelReplace
})

const dropAreaActionIcon = computed(() => {
    if (files.value.length === 0 || isMultiple.value) {
        return props.iconAdd
    }
    return props.iconReplace
})

function onSortEnd({ newIndex }: { newIndex: number | null }) {
    if (newIndex !== null) {
        selectedFileIndex.value = newIndex
    }
}
</script>

<script lang="ts">
export default {
    name: 'VvInputFile',
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
            @click.stop="onClickDropArea"
        >
            <slot name="drop-area">
                <picture class="vv-input-file__preview">
                    <img
                        v-if="previewSrc"
                        :src="previewSrc"
                        :alt="files[selectedFileIndex].name"
                    >
                </picture>
                <VvButton
                    v-if="!readonly"
                    modifiers="action"
                    :label="!previewSrc ? dropdAreaActionLabel : undefined"
                    :title="previewSrc ? dropdAreaActionLabel : undefined"
                    :disabled="disabled"
                    :class="{
                        'vv-input-file__drop-area-action': previewSrc,
                    }"
                    :icon="dropAreaActionIcon"
                    @click.stop="onClickDropArea"
                />
            </slot>
        </div>
        <div class="vv-input-file__wrapper">
            <VvIcon v-if="hasIconBefore" v-bind="hasIconBefore" />
            <input
                :id="hasId"
                ref="inputEl"
                type="file"
                :readonly
                :disabled
                :required
                :placeholder
                :aria-describedby="hasHintLabelOrSlot ? hasHintId : undefined"
                :aria-invalid="invalid"
                :aria-errormessage="
                    hasInvalidLabelOrSlot ? hasHintId : undefined
                "
                :multiple="isMultiple"
                :accept
                :capture
                :name
                @change="onChange"
            >
            <progress
                v-if="hasProgress"
                class="vv-input-file__progress"
                :value="progress"
                max="100"
            >
                {{ progress }}%
            </progress>
            <VvIcon v-if="hasIconAfter" v-bind="hasIconAfter" />
        </div>
        <Sortable
            v-model="files"
            tag="ul"
            class="vv-input-file__list"
            item-key="name"
            :move="() => sortable"
            @end="onSortEnd"
        >
            <template #item="{ element: file, index }">
                <li
                    class="vv-input-file__item"
                    :class="{
                        'active':
                            index === selectedFileIndex
                            && hasDropArea
                            && files.length > 1,
                        'cursor-move': sortable,
                    }"
                    @click.stop="onClickSelectFile(index)"
                >
                    <button
                        v-if="hasIconDownload"
                        type="button"
                        class="vv-input-file__item-action"
                        :title="labelDownload"
                        @click.stop="onClickDownloadFile(file)"
                    >
                        <VvIcon v-bind="hasIconDownload" />
                    </button>
                    <div class="vv-input-file__item-name">
                        {{ file.name }}
                    </div>
                    <small class="vv-input-file__item-info">
                        {{ formatBytes(file.size) }}
                    </small>
                    <button
                        v-if="!readonly"
                        type="button"
                        class="vv-input-file__item-remove"
                        :title="labelRemove"
                        :disabled="disabled"
                        @click.stop="onClickRemoveFile(index)"
                    />
                </li>
            </template>
        </Sortable>
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
