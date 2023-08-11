<script lang="ts">
import SpriteIcon from './SpriteIcon.vue'

export default {
  extends: SpriteIcon,
  components: { SpriteIcon },
  props: {
    class: { type: String },
  },
  computed: {
    // pass props down to the component but handle events on the <button> wrapper
    itemProps() {
      return this.$props
    },
  },
  inheritAttrs: true,
}
</script>

<template>
  <button type="button">
    <SpriteIcon v-bind="itemProps" />
  </button>
</template>

<style scoped></style>
