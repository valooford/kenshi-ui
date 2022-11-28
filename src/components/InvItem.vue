<script lang="ts">
export default {
  props: {
    img: { type: String, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
  },
}
</script>

<template>
  <img
    :src="img"
    alt=""
    :style="{
      width: `calc(var(--cell-size)*${w})`,
      height: `calc(var(--cell-size)*${h})`,
    }"
  />
</template>
