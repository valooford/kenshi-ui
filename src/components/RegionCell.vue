<script setup lang="ts"></script>

<template>
  <div class="cell" />
</template>

<style scoped>
.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  background-color: rgb(133, 128, 125);
  box-shadow: inset 0 0 4px #333;
}
.cell:hover {
  background-color: #bbb;
}
</style>
