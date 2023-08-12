<script lang="ts">
export default {
  props: {
    value: { type: Number, required: true },
  },
}
</script>

<template>
  <input type="range" :value="value" class="range" />
</template>

<style scoped>
.range {
  width: 100%;
  accent-color: #b0ad98;
}
.range::-webkit-slider-thumb {
  margin-top: -6px;
}
.range::-webkit-slider-runnable-track {
  height: 5px;
  background-color: #595553;
}
</style>
