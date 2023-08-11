<script lang="ts">
import RhombusSelector from '@/ui/RhombusSelector.vue'
import { SpriteIcon, type IIconVariant } from '@/ui/SpriteIcon'

const ICONS: { [value: number]: IIconVariant } = {
  0: 'walk',
  1: 'jog',
  2: 'run',
  3: 'run-together',
}

export default {
  components: { RhombusSelector, SpriteIcon },
  data() {
    return { ICONS, value: 0 }
  },
  methods: {
    onChange(value: number) {
      this.value = value
    },
  },
}
</script>

<template>
  <RhombusSelector direction="horizontal" :value="value" :count="4" loop @change="onChange">
    <SpriteIcon :variant="ICONS[value]!" class-name="mode-icon" />
  </RhombusSelector>
</template>

<style scoped>
.mode-icon {
  transform: scale(0.7);
}
</style>
