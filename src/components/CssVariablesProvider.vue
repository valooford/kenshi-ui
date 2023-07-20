<script lang="ts">
import { cssVariables } from '@/shared/constants'

export default {
  // if children are using teleports they can restore their CSS variables context
  provide: { cssVariables },
  data() {
    return { cssVariables }
  },
}
</script>

<template>
  <div :style="cssVariables">
    <slot />
  </div>
</template>
