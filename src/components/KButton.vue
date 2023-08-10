<script lang="ts">
import type { PropType } from 'vue'

export default {
  props: {
    type: { type: String as PropType<'default' | 'radio'>, default: 'default' },
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
      type !== 'default' && `button_${type}`,
      fullWidth && 'button_full-width',
      isSelected && 'button_selected',
    ]"
  >
    <div v-if="type === 'radio'" class="mark" />
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
  font-size: 17px;
  line-height: 20px;
  letter-spacing: 0.001em;
  background: linear-gradient(to bottom, #2c2c2c 50%, #272727 50%);
  box-shadow: inset 0 0 1px #000, inset 0 0 2px #fff;
  border: 3px solid #000;
}
.button:active {
  background: #272727;
  box-shadow: inset 0 0 1px #000, inset 0 0 2px var(--color-title);
}
.button:disabled {
  color: #000;
}
.button:hover:not(:disabled) {
  color: var(--color-title);
}
.button:hover:not(:disabled) .mark {
  background-color: var(--color-title);
}
.button_default .children {
  padding: 0 5px;
}
.button:active .mark {
  background-color: #3e311a;
}
.button_full-width {
  flex: 1;
}
.button_selected {
  color: #b0ad98;
}
.button_selected.button_radio .mark {
  background-color: #b0ad98;
}
.button_sm .children {
  padding: 0 12px;
  font-family: Exo2, sans-serif;
  font-size: 14px;
  line-height: 15px;
  font-weight: 600;
}
.button_md .children {
  line-height: 19px;
  padding: 0 7px;
  font-size: 20px;
}
.button_lg .children {
  padding: 10px 12px 9px;
}
.button_radio {
  line-height: 19px;
}
.mark {
  width: 6px;
  height: 6px;
  margin: 6px;
  background-color: #666666;
  border-radius: 3px;
}
.children {
  flex: 1;
}
</style>
