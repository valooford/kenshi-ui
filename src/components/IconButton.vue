<script lang="ts">
import type { PropType } from 'vue'

export default {
  props: {
    variant: { type: String as PropType<'close' | 'o'>, required: true },
  },
}
</script>

<template>
  <button :class="['button', `button_${variant}`]" />
</template>

<style scoped>
.button {
  background-image: url('src/assets/Kenshi_UI.png');
}
/* close */
.button_close {
  background-position: -700px -544px;
  width: 25px;
  height: 26px;
}
.button_close:hover {
  background-position-x: -736px;
}
.button_close:active {
  background-position-x: -772px;
}
/* o */
.button_o {
  background-image: url('src/assets/Kenshi_UI.png');
  background-position: -642px -422px;
  width: 25px;
  height: 26px;
}
.button_o:hover {
  background-position-x: -678px;
}
.button_o:active {
  background-position-x: -714px;
}
</style>
