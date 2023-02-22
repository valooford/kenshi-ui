<script lang="ts">
export default {
  props: {
    title: { type: String, required: true },
  },
  emits: ['close'],
  methods: {
    onClose() {
      this.$emit('close')
    },
  },
}
</script>

<template>
  <div class="window">
    <div class="header">
      {{ title }}
      <button class="close-button" @click="onClose">X</button>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped>
.window {
  padding: 5px;
  border: 2px solid #000;
}
.header {
  position: relative;
  line-height: 26px;
  margin-bottom: 5px;
  text-align: center;
  border-bottom: 1px solid #000;
}
.close-button {
  position: absolute;
  right: 0;
}
</style>
