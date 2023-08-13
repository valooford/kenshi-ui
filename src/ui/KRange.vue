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
/* reset styles for input[type=range] */
.range {
  -webkit-appearance: none; /* Allows custom slider to be made */
  appearance: none;
  width: 100%;
  background: transparent;
}
.range::-webkit-slider-thumb {
  -webkit-appearance: none;
}

/* custom styles for range */
.range::-webkit-slider-thumb {
  position: relative;
  top: 9rem;
  height: 15rem;
  width: 15rem;
  border-radius: 7.5rem;
  background-color: #b0ad98;
  margin-top: -14rem; /* Chrome-specific */
  cursor: pointer;
}
.range::-webkit-slider-runnable-track {
  width: 100%;
  height: 5rem;
  background-color: #595553;
  cursor: pointer;
}
</style>
