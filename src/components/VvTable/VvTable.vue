<script setup lang="ts">
	import { get as dotGet } from 'ts-dot-prop'
	import { VvTableEmits, VvTableProps } from '@/components/VvTable'
	import VvIcon from '@/components/VvIcon/VvIcon.vue'
	import VvButton from '@/components/VvButton/VvButton.vue'
	import VvButtonGroup from '@/components/VvButtonGroup/VvButtonGroup.vue'

	const slots = useSlots()

	const props = defineProps(VvTableProps)

	const emit = defineEmits(VvTableEmits)

	const hasTotal = computed(() =>
		props.total ? Number(props.total) : props.data.length,
	)

	const hasLimit = computed({
		get: () => (props.limit !== undefined ? Number(props.limit) : 10),
		set: (newValue) => {
			emit('update:limit', newValue)
		},
	})

	const hasPage = computed({
		get: () => (props.page !== undefined ? Number(props.page) : 1),
		set: (newValue) => {
			emit('update:page', newValue)
		},
	})

	const hasSort = useVModel(props, 'sort', emit)

	const hasOrder = useVModel(props, 'order', emit)

	const hasPageCount = computed(() => {
		if (hasTotal.value !== undefined && hasLimit.value) {
			return Math.ceil(hasTotal.value / hasLimit.value)
		}
		return
	})

	const hasColumns = computed(() => {
		return props.columns.map((item) => {
			if (typeof item === 'string') {
				return { name: item, label: item }
			}
			return item
		})
	})

	const hasNavAndLimitDisabled = computed(() => {
		return props.isLoading || hasPageCount.value === 0
	})

	const hasNextDisabled = computed(() => {
		return (
			hasNavAndLimitDisabled.value ||
			props.nextDisabled ||
			hasPage.value === hasPageCount.value ||
			!hasPageCount.value
		)
	})

	const hasPrevDisabled = computed(() => {
		return hasNavAndLimitDisabled.value || hasPage.value === 1
	})

	const hasLimitSteps = computed(() =>
		props.limitSteps.filter((item) =>
			hasTotal.value ? item <= hasTotal.value : true,
		),
	)

	const currentData = computed(() => {
		if (
			hasPage.value &&
			hasPageCount?.value &&
			props.data.length > hasLimit.value
		) {
			const startIndex = hasPage.value * hasLimit.value - hasLimit.value
			return props.data.slice(startIndex, hasPage.value * hasLimit.value)
		}
		return props.data
	})

	watch([hasSort, hasOrder, hasLimit], (newValue, oldValue) => {
		if (oldValue && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
			hasPage.value = 1
		}
	})

	const onClickSort = (columnName: string) => {
		if (hasSort.value === columnName) {
			hasOrder.value = hasOrder.value === 'asc' ? 'desc' : 'asc'
			return
		}
		hasSort.value = columnName
	}

	const onClickNext = () => {
		hasPage.value++
	}

	const onClickPrev = () => {
		hasPage.value--
	}

	const onClickPage = (page: number) => {
		hasPage.value = page
	}

	// send default values to parent
	onMounted(() => {
		if (!props.page) {
			emit('update:page', hasPage.value)
		}
		if (!props.limit) {
			emit('update:limit', hasLimit.value)
		}
	})
</script>

<template>
	<div class="sortable-table">
		<div class="sortable-table__wrapper">
			<table class="vv-table">
				<thead>
					<tr>
						<th
							v-for="column in hasColumns"
							:key="column.name"
							v-bind="{
								class: [
									column.class,
									column.classTh,
									{
										selected: hasSort === column.name,
									},
								],
							}"
						>
							<div v-if="!column.sortable" class="ellipsis">
								{{ column.label }}
							</div>
							<button
								v-else
								type="button"
								class="pr-md"
								@click="onClickSort(column.name)"
							>
								{{ column.label }}
								<VvIcon
									v-bind="
										hasSort === column.name
											? {
													name:
														hasOrder === 'asc'
															? 'order-up'
															: 'order-down',
											  }
											: {
													name: 'order-down',
											  }
									"
								/>
							</button>
						</th>
					</tr>
				</thead>
				<TransitionGroup tag="tbody" :name="transitionName">
					<slot
						name="tbody"
						v-bind="{ columns: hasColumns, data, isLoading }"
					>
						<slot v-if="isLoading" name="loading">
							<tr v-for="index in hasLimit" :key="index">
								<td
									v-for="{ name, wrapperClass } in hasColumns"
									:key="name"
								>
									<slot
										v-bind="{
											index,
											wrapperClass,
										}"
										:name="`skeleton::${name}`"
									>
										<div
											class="vv-skeleton"
											:class="wrapperClass"
										>
											<div
												class="vv-skeleton__item"
											></div>
										</div>
									</slot>
								</td>
							</tr>
						</slot>
						<template v-else-if="!isError">
							<template v-if="data.length">
								<tr
									v-for="(row, index) in currentData"
									:key="index"
								>
									<td
										v-for="{
											name,
											field,
											wrapperClass,
											render,
											...column
										} in hasColumns"
										:key="name"
										:class="[column.class, column.classTd]"
									>
										<template v-if="render">
											<component
												:is="render(row, index)"
											/>
										</template>
										<slot
											v-else-if="slots[`col::${name}`]"
											v-bind="{
												row,
												field,
												wrapperClass,
												index,
												value: row[name],
											}"
											:name="`col::${name}`"
										/>
										<slot
											v-else
											v-bind="{
												name,
												row,
												field,
												wrapperClass,
												index,
												value: row[name],
											}"
											name="col"
										>
											<div
												class="text-ellipsis overflow-hidden"
												:class="wrapperClass"
											>
												{{ dotGet(row, field ?? name) }}
											</div>
										</slot>
									</td>
								</tr>
							</template>
							<slot v-else name="empty" />
						</template>
						<slot v-else name="error" />
					</slot>
				</TransitionGroup>
				<tfoot v-if="slots.tfoot">
					<slot name="tfoot" />
				</tfoot>
				<caption v-if="slots.caption">
					<slot name="caption" />
				</caption>
			</table>
		</div>
		<slot
			name="navigation"
			v-bind="{
				hide: hideNavigation,
				prevDisabled: hasPrevDisabled,
				prev: onClickPrev,
				nextDisabled: hasNextDisabled,
				next: onClickNext,
				total: hasPageCount,
				page: hasPage,
			}"
		>
			<div v-if="!hideNavigation" class="mt-auto grid grid-cols-2 pt-md">
				<div class="flex items-center">
					<label for="items-shown" class="text-12"
						>{{ labelItemsShown }}:</label
					>
					<select
						v-if="hasLimitSteps.length"
						id="items-shown"
						v-model="hasLimit"
						:disabled="hasNavAndLimitDisabled"
						name="items-shown"
						class="sortable-table__limit"
					>
						<option
							v-for="step in hasLimitSteps"
							:key="step"
							:value="step"
						>
							{{ step }}
						</option>
					</select>
					<span v-else id="items-shown" class="sortable-table__total">
						{{ hasTotal }}
					</span>
				</div>
				<div class="flex justify-end items-center">
					<VvButtonGroup>
						<VvButton
							:title="labelPrev"
							:disabled="hasPrevDisabled"
							icon="chevron-left"
							modifiers="secondary"
							@click.stop="onClickPrev()"
						/>
						<VvButton
							:label="`${hasPage}/${hasPageCount}`"
							:disabled="hasNavAndLimitDisabled"
							:style="{ pointerEvents: 'none' }"
							class="font-normal"
							modifiers="secondary"
							@click.stop="onClickPage(hasPage)"
						/>
						<VvButton
							:title="labelNext"
							:disabled="hasNextDisabled"
							icon="chevron-right"
							modifiers="secondary"
							@click.stop="onClickNext()"
						/>
					</VvButtonGroup>
					<!-- <small v-if="hasPageCount" class="ml-6 text-12">
						{{ labelTotalPages }} {{ hasPageCount }}
					</small> -->
				</div>
			</div>
		</slot>
	</div>
</template>

<style lang="scss">
	.sortable-table {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		min-width: 0;

		&__wrapper {
			// border: var(--border) solid var(--color-surface-4);
			border-radius: var(--rounded);
			background: var(--color-surface);
			width: 100%;
			overflow: auto;
		}

		th {
			&.selected {
				background: var(--color-gray-lighten-5);
			}

			& > button {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				border: none;
				background: none;
				font-size: inherit;
				font-weight: inherit;
				color: inherit;
				cursor: pointer;
				gap: var(--spacing-8);
			}
		}

		&__limit {
			font-size: var(--text-12);
			padding: 0 var(--spacing-12) 0 var(--spacing-8);
			background-image: var(--bg-chevron);
			background-repeat: no-repeat;
			background-position: right center;
			background-size: 1em;
			cursor: pointer;

			&:disabled {
				cursor: not-allowed;
				opacity: var(--opacity-50);
			}
		}

		&__total {
			font-size: var(--text-12);
			padding: 0 var(--spacing-8);
		}
	}
</style>
