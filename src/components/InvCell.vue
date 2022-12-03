<script lang="ts">
export default {
  props: {
    isOver: { type: Boolean, required: true },
  },
  emits: ['dragenter', 'dragleave'],
  methods: {
    onDragEnter() {
      setTimeout(() => {
        this.$emit('dragenter')
      }, 0)
    },
    onDragLeave() {
      this.$emit('dragleave')
    },
  },
}
</script>

<template>
  <div
    :class="['cell', isOver && 'hover']"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave="onDragLeave"
  />
</template>

<style scoped>
.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  background-color: rgb(133, 128, 125);
  box-shadow: inset 0 0 4px #333;
}
.hover {
  background-color: rgb(194, 187, 183);
  box-shadow: inset 0 0 4px rgba(51, 51, 51, 0.3);
}
</style>
