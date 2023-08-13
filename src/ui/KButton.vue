<script lang="ts">
import type { PropType } from 'vue'

export default {
  props: {
    size: { type: String as PropType<'default' | 'sm' | 'md' | 'lg'>, default: 'default' },
    fullWidth: { type: Boolean },
    isSelected: { type: Boolean },
  },
}
</script>

<template>
  <button
    :class="[
      'button',
      `button_${size}`,
      fullWidth && 'button_full-width',
      isSelected && 'button_selected',
    ]"
  >
    <slot name="before"></slot>
    <div class="children">
      <slot></slot>
    </div>
  </button>
</template>

<style scoped>
.button {
  position: relative;
  display: flex;
  align-items: center;
  color: #666666;
  text-align: center;
  font-family: Sentencia, sans-serif;
  font-size: 17rem;
  line-height: 20rem;
  letter-spacing: 0.001em;
  background: linear-gradient(to bottom, #2c2c2c 50%, #272727 50%);
  box-shadow: inset 0 0 1rem #000, inset 0 0 2rem #fff;
  border: 3rem solid #000;
  user-select: none;
}
.button:active {
  background: #272727;
  box-shadow: inset 0 0 1rem #000, inset 0 0 2rem var(--color-title);
}
.button:disabled {
  color: #000;
}
.button:not(:disabled):hover {
  color: var(--color-title);
}
.button:not(:disabled):active {
  color: #66502b;
}
.button_default .children {
  padding: 0 5rem;
}
.button_full-width {
  flex: 1;
}
.button_selected {
  color: #b0ad98;
}
.button_sm .children {
  padding: 0 12rem;
  font-family: Exo2, sans-serif;
  font-size: 14rem;
  line-height: 15rem;
  font-weight: 600;
}
.button_md .children {
  line-height: 19rem;
  padding: 0 7rem;
  font-size: 20rem;
}
.button_lg .children {
  padding: 10rem 12rem 9rem;
}
.children {
  flex: 1;
}
</style>
