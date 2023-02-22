<script lang="ts">
import type { PropType } from 'vue'

import type { IRegion } from '../interface'
import InvItem from './InvItem.vue'

export default {
  extends: InvItem,
  components: { InvItem },
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
  <InvItem
    v-bind="itemProps"
    :handle-drag-start="onDragStart"
    @dragstart="$emit('dragstart', $event)"
    @drop="$emit('drop', $event)"
    @dragend="$emit('dragend', $event)"
  />
</template>

<style scoped></style>
