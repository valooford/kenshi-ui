<script lang="ts">
import KItem from './KItem.vue'

export default {
  extends: KItem,
  components: { KItem },
  props: {
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
  },
}
</script>

<template>
  <KItem v-bind="itemProps" />
</template>

<style scoped></style>
