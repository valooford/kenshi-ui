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
    @dragleave="onDragLeave"
  />
</template>

<style scoped>
.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  background-color: #3d3938;
  box-shadow: inset 0 0 0 1px #1c1c1c, inset 0 0 8px #222, inset 0 0 8px #222;
}
.hover {
  background-color: #c2bbb7;
  box-shadow: inset 0 0 4px rgba(51, 51, 51, 0.3);
}
</style>
