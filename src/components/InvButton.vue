<script lang="ts">
import type { PropType } from 'vue'

export default {
  props: {
    size: { type: String as PropType<'default' | 'sm' | 'lg'>, default: 'default' },
  },
}
</script>

<template>
  <button :class="['button', size === 'sm' && 'button_sm', size === 'lg' && 'button_lg']">
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  padding: 0 5px;
  color: #666666;
  text-align: center;
  font-family: Sentencia, sans-serif;
  font-size: 17px;
  line-height: 20px;
  letter-spacing: 0.001em;
  background-image: linear-gradient(to bottom, #2c2c2c 50%, #272727 50%);
  box-shadow: inset 0 0 1px #000, inset 0 0 2px #fff;
  border: 3px solid #000;
  cursor: pointer;
}
.button_sm {
  padding: 0 12px;
  font-family: Exo2, sans-serif;
  font-size: 14px;
  line-height: 15px;
  font-weight: 600;
}
.button_lg {
  padding: 10px 12px 9px;
}
.button:disabled {
  color: #000;
  cursor: default;
}
.button:hover:not(:disabled) {
  color: var(--color-title);
}
</style>
