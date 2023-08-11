<script lang="ts">
import SpriteIcon from './SpriteIcon/SpriteIcon.vue'

export default {
  components: { SpriteIcon },
  data() {
    return { isChecked: false }
  },
  methods: {
    onChange(e: Event) {
      const value = (e.target as HTMLInputElement).checked
      this.isChecked = value
    },
  },
}
</script>

<template>
  <label>
    <input type="checkbox" :value="isChecked" class="checkbox" @change="onChange" />
    <SpriteIcon :variant="isChecked ? 'checkbox-on' : 'checkbox-off'" />
  </label>
</template>

<style scoped>
.checkbox {
  display: none;
}
</style>
