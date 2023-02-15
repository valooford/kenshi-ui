<script lang="ts">
export default {}
</script>

<template>
  <div class="window">
    <slot></slot>
  </div>
</template>

<style scoped>
.window {
  padding: 5px;
  border: 2px solid #000;
}
</style>
