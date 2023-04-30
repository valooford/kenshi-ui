<script lang="ts">
import type { PropType } from 'vue'

import KItem from './KItem.vue'

export default {
  extends: KItem,
  components: { KItem },
  props: {
    region: { type: Object as PropType<IRegion>, required: true },
    /** @private Not intended to use */
    hidden: {
      validator() {
        return false
      },
    },
  },
  computed: {
    itemProps() {
      const { w, h, img, type } = this.$props
      return { w, h, img, type }
    },
  },
  methods: {
    onDragStart(e: DragEvent) {
      e.dataTransfer!.setData('dnd/region', JSON.stringify(this.region))
    },
  },
}
</script>

<template>
  <KItem
    v-bind="itemProps"
    :handle-drag-start="onDragStart"
    @dragstart="$emit('dragstart', $event)"
    @drop="$emit('drop', $event)"
    @dragend="$emit('dragend', $event)"
  />
</template>

<style scoped></style>
