<script lang="ts">
import type { PropType } from 'vue'

import KItem from './KItem.vue'

export default {
  extends: KItem,
  components: { KItem },
  inject: ['store', 'dispatch'],
  props: {
    id: { type: String as PropType<string> as PropType<IBackpackItemId>, required: true },
    /** @private Not intended to use */
    visible: {
      validator() {
        return false
      },
    },
  },
  computed: {
    itemProps() {
      const { id } = this.$props
      return { id }
    },
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    data() {
      return this.s.items[this.id]!
    },
  },
  methods: {
    closeBackpack() {
      if (this.data.isOpened) this.d.closeBackpack(this.id)
    },
  },
}
</script>

<template>
  <KItem :handle-drag-start="closeBackpack" :handle-fast-move="closeBackpack" v-bind="itemProps" />
</template>

<style scoped></style>
