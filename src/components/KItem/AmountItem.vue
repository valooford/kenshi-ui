<script lang="ts">
import type { PropType } from 'vue'

import KItem from './KItem.vue'

export default {
  extends: KItem,
  components: { KItem },
  props: {
    id: { type: String as PropType<string> as PropType<IAmountItemId>, required: true },
    /** @private Not intended to use */
    visible: {
      validator() {
        return false
      },
    },
  },
  data() {
    return {
      amountDragging: null as number | null,
      // used instead of "this.isPreview || this.isDragging" pair because of lack of the reactivity in the latter
      isExcessVisible: false,
    }
  },
  computed: {
    itemProps() {
      const { id } = this.$props
      return { id }
    },
    amount() {
      return (this.data as IAmountItem).amount
    },
    scrap() {
      return (this.data as IAmountItem).scrap
    },
    count() {
      if (!this.amount) return undefined
      return Math.ceil(this.amount - Number(this.amountDragging))
    },
    notEnoughToShowCount() {
      return !this.count || this.count <= 1
    },
    enoughAmountToShowItem() {
      return !!this.count && this.count > 0
    },
    progressValue() {
      if (!this.amount) return undefined
      return this.isExcessVisible ? 100 : (this.amount % 1 || 1) * 100
    },
    progressScrap() {
      if (!this.amount) return undefined
      return (this.amount % 1 || 1) * 100
    },
  },
  methods: {
    onDragStart(e: DragEvent) {
      let amount = 1
      const isAll = e.shiftKey || e.ctrlKey
      if (this.amount) {
        if (isAll) amount = this.amount
        else amount = this.amount % 1 || 1
      }
      this.amountDragging = amount
      e.dataTransfer!.setData('dnd/all', `${+isAll}`)
      e.dataTransfer!.setData(`dnd/ox;value=${e.clientX}`, '')
      e.dataTransfer!.setData(`dnd/oy;value=${e.clientY}`, '')
      this.isExcessVisible = true
    },
    onDragEnd() {
      this.amountDragging = null
      this.isExcessVisible = false
    },
  },
}
</script>

<template>
  <KItem
    v-bind="itemProps"
    :visible="enoughAmountToShowItem"
    :handle-drag-start="onDragStart"
    :handle-drag-end="onDragEnd"
  >
    <template #item>
      <progress v-if="scrap && amount" :value="progressValue" max="100" class="scrap"></progress>
      <div v-if="!notEnoughToShowCount" class="count">
        {{ count }}
      </div>
    </template>
    <template #preview>
      <progress v-if="scrap && amount" :value="progressScrap" max="100" class="scrap"></progress>
      <div v-if="amountDragging && amountDragging > 1" class="count">
        {{ Math.ceil(amountDragging) }}
      </div>
    </template>
  </KItem>
</template>

<style scoped>
.scrap {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5rem;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
}
.scrap::-webkit-progress-bar {
  background-color: #000;
  background-clip: padding-box;
  border: 1rem solid transparent;
  border-top: none;
}
.scrap::-webkit-progress-value {
  background-color: #fff;
}
.count {
  position: absolute;
  right: 0;
  bottom: 5rem;
  color: #fff;
  font-size: 15rem;
  font-weight: 600;
  pointer-events: none;
}
</style>
