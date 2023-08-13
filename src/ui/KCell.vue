<script lang="ts">
export default {
  props: {
    isOver: { type: Boolean, required: true },
  },
}
</script>

<template>
  <div :class="['cell', isOver && 'hover']" />
</template>

<style scoped>
.cell {
  position: relative;
  width: var(--cell-size);
  height: var(--cell-size);
  background-color: #3d3938;
  box-shadow: inset 0 0 0 1rem #1c1c1c, inset 0 0 8rem #222, inset 0 0 8rem #222;
  pointer-events: none;
}
.hover {
  box-shadow: inset 0 0 4rem rgba(51, 51, 51, 0.3);
}
.hover:before {
  display: block;
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #c2bbb7;
  z-index: 1;
}
</style>
