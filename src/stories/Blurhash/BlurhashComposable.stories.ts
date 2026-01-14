import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { useBlurhash } from '@/composables/useBlurhash'

const meta: Meta = {
    title: 'Composables/useBlurhash',
    tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
    parameters: {
        docs: {
            canvas: {
                sourceState: 'shown',
            },
            source: {
                code: `<script setup lang="ts">
    import { ref } from 'vue'
    import { useBlurhash } from '@volverjs/ui-vue/composables'
    import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'

    const isLoading = ref(false)
    const { encode, decode, loadImage } = useBlurhash()
    const file = ref({})
    const canvas = ref()
    const isImgLoaded = ref(false)
    const blurhash = ref('')
    const imageUrl = ref('')
    const image = ref()

    const handleFileChange = async (newValue) => {
        if (!newValue?.size) {
            image.value = null
            imageUrl.value = ''
            blurhash.value = ''
            return
        }
        isLoading.value = true
        imageUrl.value = URL.createObjectURL(newValue)
        image.value = await loadImage(imageUrl.value)
        blurhash.value = await encode(newValue)
        isLoading.value = false
    }

    const handleBlurhashChange = async (newValue) => {
    if (image.value) {
        isLoading.value = true
        const blurhashDecoded = await decode(
            newValue,
            image.value.width,
            image.value.height,
        )
        isLoading.value = false

        if (canvas.value) {
        canvas.value.width = image.value.width
        canvas.value.height = image.value.height
        const ctx = canvas.value.getContext('2d')
        const imageData = ctx.createImageData(
            canvas.value.width,
            canvas.value.height,
        )
        imageData.data.set(blurhashDecoded)
        ctx.putImageData(imageData, 0, 0)
        }
    }
    }

    watch(file, handleFileChange, { immediate: true })
    watch(blurhash, handleBlurhashChange)
</script>

<template>
  <div class="w-full lg:w-10/12 xl:w-8/12 grid gap-md sm:grid-cols-3 mb-md">
    <div>
      <div class="text-lg font-bold mb-md">Upload</div>
      <vv-input-file v-model="file" name="input-file" modifiers="square hidden" drop-area accept=".gif,.jpg,.jpeg,.png,image/gif,image/jpeg,image/png" />
    </div>
    <div v-if="image">
      <div class="text-lg font-bold mb-md">Blurhash</div>
      <div class="vv-skeleton bg-chessboard flex items-center relative aspect-square">
        <div v-if="isLoading" class="vv-skeleton__item inset-0 absolute h-full" />
        <canvas
          v-show="blurhash"
          ref="canvas"
          class="w-full block object-cover"
          :width="image.width"
          :height="image.height"
        />
      </div>
    </div>
    <div v-if="image">
      <div class="text-lg font-bold mb-md">Original</div>
      <div class="vv-skeleton bg-chessboard flex items-center relative aspect-square">
        <div v-if="isLoading" class="vv-skeleton__item inset-0 absolute h-full" />
        <img
          class="w-full block h-auto"
          :src="imageUrl"
          alt="image"
          :width="image.width"
          :height="image.height"
        />
      </div>
    </div>
  </div>
</template>`,
            },
        },
    },
    render: args => ({
        components: { VvInputFile },
        setup() {
            const isLoading = ref(false)
            const { encode, decode, loadImage } = useBlurhash()
            const file = ref({})
            const canvas = ref()
            const isImgLoaded = ref(false)
            const blurhash = ref('')
            const imageUrl = ref('')
            const image = ref()

            return {
                args,
                isLoading,
                canvas,
                encode,
                decode,
                file,
                blurhash,
                isImgLoaded,
                loadImage,
                image,
                imageUrl,
            }
        },
        watch: {
            file: {
                immediate: true,
                async handler(newValue) {
                    if (!newValue?.size) {
                        this.image = null
                        this.imageUrl = ''
                        this.blurhash = ''
                        return
                    }
                    this.isLoading = true
                    this.imageUrl = URL.createObjectURL(newValue)
                    this.image = await this.loadImage(this.imageUrl)
                    this.blurhash = await this.encode(newValue)
                    this.isLoading = false
                },
            },
            blurhash: {
                async handler(newValue) {
                    if (this.image) {
                        this.isLoading = true
                        const blurhashDecoded = await this.decode(
                            newValue,
                            this.image.width,
                            this.image.height,
                        )
                        this.isLoading = false

                        if (this.canvas) {
                            this.canvas.width = this.image.width
                            this.canvas.height = this.image.height
                            const ctx = this.canvas.getContext('2d')
                            const imageData = ctx.createImageData(
                                this.canvas.width,
                                this.canvas.height,
                            )
                            imageData.data.set(blurhashDecoded)
                            ctx.putImageData(imageData, 0, 0)
                        }
                    }
                },
            },
        },
        template: /* html */ `
			<div class="w-full lg:w-10/12 xl:w-8/12 grid gap-md sm:grid-cols-3 mb-md">
				<div>
					<div class="text-lg font-bold mb-md">Upload</div>
					<vv-input-file v-model="file" name="input-file" modifiers="square hidden" drop-area accept=".gif,.jpg,.jpeg,.png,image/gif,image/jpeg,image/png" />
				</div>
				<div v-if="image">
					<div class="text-lg font-bold mb-md">Blurhash</div>
					<div class="vv-skeleton bg-chessboard flex items-center relative aspect-square">
						<div v-if="isLoading" class="vv-skeleton__item inset-0 absolute h-full"></div>
						<canvas
							v-show="blurhash"
							ref="canvas"
							class="w-full block object-cover"
							:width="image.width"
							:height="image.height" />
					</div>
				</div>
				<div v-if="image">
					<div class="text-lg font-bold mb-md">Original</div>
					<div class="vv-skeleton bg-chessboard flex items-center relative aspect-square">
						<div v-if="isLoading" class="vv-skeleton__item inset-0 absolute h-full"></div>
						<img
							class="w-full block h-auto"
							:src="imageUrl"
							alt="image"
							:width="image.width"
							:height="image.height" />
					</div>
				</div>
			</div>
		`,
    }),
}
