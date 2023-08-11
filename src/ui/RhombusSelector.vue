<script lang="ts">
import type { PropType } from 'vue'
import { SpriteIcon, SpriteIconButton } from './SpriteIcon'

export default {
  components: { SpriteIcon, SpriteIconButton },
  emits: {
    change: (value: number) => typeof value === 'number',
  },
  props: {
    direction: { type: String as PropType<'horizontal' | 'vertical'>, required: true },
    value: { type: Number, required: true },
    count: { type: Number, required: true },
    loop: { type: Boolean },
  },
  methods: {
    onPrev() {
      let value = this.value - 1
      if (value < 0) {
        if (!this.loop) return
        value = this.count - 1
      }
      this.$emit('change', value)
    },
    onNext() {
      let value = this.value + 1
      if (value === this.count) {
        if (!this.loop) return
        value = 0
      }
      this.$emit('change', value)
    },
  },
}
</script>

<template>
  <div class="selector">
    <SpriteIcon variant="rhombus" />
    <template v-if="direction === 'horizontal'">
      <div class="selector__button selector__prev">
        <SpriteIconButton variant="arrow-left" @click="onPrev" />
      </div>
      <div class="selector__button selector__next">
        <SpriteIconButton variant="arrow-right" @click="onNext" />
      </div>
    </template>
    <template v-if="direction === 'vertical'">
      <div class="selector__button selector__up">
        <SpriteIconButton variant="arrow-top" @click="onNext" />
      </div>
      <div class="selector__button selector__down">
        <SpriteIconButton variant="arrow-bottom" @click="onPrev" />
      </div>
    </template>
    <div class="selector__value">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.selector {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selector__button {
  position: absolute;
  transform: scale(0.8);
}
.selector__prev {
  left: 6px;
}
.selector__next {
  right: 6px;
}
.selector__up {
  top: 6px;
}
.selector__down {
  bottom: 6px;
}
.selector__value {
  position: absolute;
}
</style>
