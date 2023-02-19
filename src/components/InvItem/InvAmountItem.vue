<script lang="ts">
import InvItem from './InvItem.vue'

export default {
  extends: InvItem,
  components: { InvItem },
  props: {
    amount: { type: Number, required: true },
    scrap: { type: Boolean },
    /** @private Not intended to use */
    hidden: {
      validator() {
        return false
      },
    },
  },
  data() {
    return {
      amountDragging: null as number | null,
    }
  },
  computed: {
    itemProps() {
      const { w, h, img, type } = this.$props
      return { w, h, img, type }
    },
    count() {
      if (!this.amount) return undefined
      return Math.ceil(this.amount - Number(this.amountDragging))
    },
    notEnoughToShowCount() {
      return !this.count || this.count <= 1
    },
    notEnoughAmountToShowItem() {
      return !this.count || this.count === 0
    },
    progressValue() {
      if (!this.amount) return undefined
      return this.isPreview || this.isDragging ? 100 : (this.amount % 1 || 1) * 100
    },
    progressScrap() {
      if (!this.amount) return undefined
      return (this.amount % 1 || 1) * 100
    },
  },
  methods: {
    onDragStart(e: DragEvent) {
      let amount = 1
      if (this.amount) {
        if (e.shiftKey) amount = this.amount
        else amount = this.amount % 1 || 1
      }
      this.amountDragging = amount
      e.dataTransfer!.setData('dnd/amount', `${amount}`)
      if (this.scrap) e.dataTransfer!.setData('dnd/scrap', `${+this.scrap}`)
    },
    onDragEnd() {
      this.amountDragging = null
    },
  },
}
</script>

<template>
  <InvItem
    v-bind="itemProps"
    :hidden="notEnoughAmountToShowItem"
    :handle-drag-start="onDragStart"
    :handle-drag-end="onDragEnd"
    @dragstart="$emit('dragstart', $event)"
    @drop="$emit('drop', $event)"
    @dragend="$emit('dragend', $event)"
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
  </InvItem>
</template>

<style scoped>
.scrap {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
}
.scrap::-webkit-progress-bar {
  background-color: #000;
  background-clip: padding-box;
  border: 1px solid transparent;
  border-top: none;
}
.scrap::-webkit-progress-value {
  background-color: #fff;
}
.count {
  position: absolute;
  right: 0;
  bottom: 5px;
  color: #fff;
  font-weight: 600;
  pointer-events: none;
}
</style>
