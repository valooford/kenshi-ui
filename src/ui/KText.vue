<script lang="ts">
import type { PropType } from 'vue'

type ITextVariant = 'default' | 'alt' | 'huge'
type ITextColor = 'default' | 'label' | 'title' | 'attendant' | 'greyed' | 'good' | 'bad'

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
  line-height: 20rem;
  letter-spacing: 0.02em;
  text-shadow: 1rem 1rem 1rem #000;
}
.text_default {
  font-family: Exo2, sans-serif;
  font-size: 14rem;
  font-weight: 600;
}
.text_alt {
  font-family: Sentencia, sans-serif;
  font-size: 17rem;
  text-transform: uppercase;
}
.text_huge {
  color: #ded8cc;
  font-family: MailartRubberstamp, sans-serif;
  font-size: 76rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.text_label {
  color: #fff;
  font-size: 15rem;
  font-weight: 400;
  line-height: 20rem;
  white-space: nowrap;
}
.text_title {
  color: var(--color-title);
}
.text_attendant {
  color: var(--color-main);
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
