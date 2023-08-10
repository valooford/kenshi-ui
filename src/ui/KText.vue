<script lang="ts">
import type { PropType } from 'vue'

type ITextVariant = 'default' | 'alt'
type ITextColor = 'default' | 'title' | 'greyed' | 'good' | 'bad'

export default {
  props: {
    variant: { type: String as PropType<ITextVariant>, default: 'default' },
    color: {
      type: String as PropType<ITextColor>,
      default: 'default',
    },
  },
}
</script>

<template>
  <div :class="['text', `text_${variant}`, color !== 'default' && `text_${color}`]">
    <slot />
  </div>
</template>

<style scoped>
.text {
  display: inline;
  color: #9c9c9c;
  line-height: 20px;
  letter-spacing: 0.02em;
  text-shadow: 1px 1px 1px #000;
}
.text_default {
  font-family: Exo2, sans-serif;
  font-size: 14px;
  font-weight: 600;
}
.text_alt {
  font-family: Sentencia, sans-serif;
  font-size: 17px;
}
.text_title {
  color: var(--color-title);
}
.text_greyed {
  color: var(--color-greyed);
}
.text_good {
  color: var(--color-good);
}
.text_bad {
  color: var(--color-bad);
}
</style>
